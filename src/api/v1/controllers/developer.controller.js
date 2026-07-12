import { Project } from '../../../modules/projects/models/Project.model.js';
import { Message } from '../../../modules/messages/models/Message.model.js';
import { DeveloperTask } from '../../../modules/developer-work/models/DeveloperTask.model.js';
import { TaskComment } from '../../../modules/developer-work/models/TaskComment.model.js';
import { DeveloperTimeEntry } from '../../../modules/developer-work/models/DeveloperTimeEntry.model.js';
import { BugReport } from '../../../modules/developer-work/models/BugReport.model.js';
import { Deployment } from '../../../modules/developer-work/models/Deployment.model.js';
import { DeveloperLeave } from '../../../modules/developer-work/models/DeveloperLeave.model.js';
import { DeveloperActivity } from '../../../modules/developer-work/models/DeveloperActivity.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { ApiError } from '../../../shared/http/apiErrors.js';

function startOfWeek() {
  const now = new Date();
  const day = now.getDay() || 7;
  const date = new Date(now);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day + 1);
  return date;
}

async function ensureOwnTask(taskId, developerId) {
  const task = await DeveloperTask.findOne({ _id: taskId, assigneeId: developerId });
  if (!task) {
    throw new ApiError({ statusCode: 404, code: 'NOT_FOUND', message: 'Task not found' });
  }
  return task;
}

export const developerController = {
  dashboard: asyncHandler(async (req, res) => {
    const developerId = req.user.userId;
    const weekStart = startOfWeek();

    const [projects, tasks, weekEntries, messages, bugs, deployments, leaves, activities] = await Promise.all([
      Project.find({ assignedDeveloperIds: developerId }).sort({ updatedAt: -1 }).limit(6).lean(),
      DeveloperTask.find({ assigneeId: developerId }).sort({ dueDate: 1, updatedAt: -1 }).limit(12).lean(),
      DeveloperTimeEntry.find({ developerId, startedAt: { $gte: weekStart } }).lean(),
      Message.find({ userId: developerId }).sort({ createdAt: -1 }).limit(5).lean(),
      BugReport.find({ assigneeId: developerId, status: { $in: ['open', 'in_progress'] } }).sort({ updatedAt: -1 }).limit(6).lean(),
      Deployment.find({ authorId: developerId }).sort({ createdAt: -1 }).limit(5).lean(),
      DeveloperLeave.find({ developerId }).sort({ createdAt: -1 }).limit(5).lean(),
      DeveloperActivity.find({ developerId }).sort({ createdAt: -1 }).limit(8).lean()
    ]);

    const weekMinutes = weekEntries.reduce((sum, entry) => sum + (entry.durationMinutes || 0), 0);
    const dueSoon = tasks.filter((task) => task.dueDate && new Date(task.dueDate).getTime() <= Date.now() + 7 * 24 * 60 * 60 * 1000);

    return sendSuccess(res, {
      data: {
        stats: {
          activeProjects: projects.length,
          assignedTasks: tasks.length,
          dueSoon: dueSoon.length,
          weekMinutes,
          openBugs: bugs.length,
          unreadMessages: messages.filter((message) => message.status === 'new').length,
          pendingLeaves: leaves.filter((leave) => leave.status === 'pending').length
        },
        projects,
        tasks,
        messages,
        bugs,
        deployments,
        leaves,
        activities
      }
    });
  }),

  projects: asyncHandler(async (req, res) => {
    const projects = await Project.find({ assignedDeveloperIds: req.user.userId }).sort({ updatedAt: -1 }).lean();
    return sendSuccess(res, { data: projects });
  }),

  tasks: asyncHandler(async (req, res) => {
    const tasks = await DeveloperTask.find({ assigneeId: req.user.userId }).sort({ dueDate: 1, updatedAt: -1 }).lean();
    return sendSuccess(res, { data: tasks });
  }),

  updateTaskStatus: asyncHandler(async (req, res) => {
    const task = await ensureOwnTask(req.params.id, req.user.userId);
    task.status = req.body.status;
    task.completedAt = req.body.status === 'done' ? new Date() : null;
    await task.save();

    await DeveloperActivity.create({
      developerId: req.user.userId,
      projectId: task.projectId,
      eventType: 'task_status_updated',
      message: `Task "${task.title}" moved to ${task.status}.`
    });

    return sendSuccess(res, { data: task });
  }),

  addTaskComment: asyncHandler(async (req, res) => {
    const task = await ensureOwnTask(req.params.id, req.user.userId);
    const comment = await TaskComment.create({
      taskId: task._id,
      authorId: req.user.userId,
      body: req.body.body
    });

    await DeveloperActivity.create({
      developerId: req.user.userId,
      projectId: task.projectId,
      eventType: 'task_comment_added',
      message: `Comment added on "${task.title}".`
    });

    return sendSuccess(res, { data: comment });
  }),

  timeEntries: asyncHandler(async (req, res) => {
    const entries = await DeveloperTimeEntry.find({ developerId: req.user.userId }).sort({ startedAt: -1 }).limit(100).lean();
    return sendSuccess(res, { data: entries });
  }),

  createTimeEntry: asyncHandler(async (req, res) => {
    const entry = await DeveloperTimeEntry.create({
      developerId: req.user.userId,
      projectId: req.body.projectId || null,
      taskId: req.body.taskId || null,
      startedAt: req.body.startedAt,
      endedAt: req.body.endedAt || null,
      durationMinutes: req.body.durationMinutes,
      note: req.body.note || '',
      source: req.body.source || 'manual'
    });

    await DeveloperActivity.create({
      developerId: req.user.userId,
      projectId: req.body.projectId || null,
      eventType: 'time_entry_added',
      message: `${req.body.durationMinutes} minutes logged.`
    });

    return sendSuccess(res, { data: entry });
  }),

  bugs: asyncHandler(async (req, res) => {
    const bugs = await BugReport.find({ assigneeId: req.user.userId }).sort({ updatedAt: -1 }).lean();
    return sendSuccess(res, { data: bugs });
  }),

  deployments: asyncHandler(async (req, res) => {
    const deployments = await Deployment.find({ authorId: req.user.userId }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { data: deployments });
  }),

  leaves: asyncHandler(async (req, res) => {
    const leaves = await DeveloperLeave.find({ developerId: req.user.userId }).sort({ createdAt: -1 }).lean();
    return sendSuccess(res, { data: leaves });
  }),

  requestLeave: asyncHandler(async (req, res) => {
    if (new Date(req.body.endDate).getTime() < new Date(req.body.startDate).getTime()) {
      throw new ApiError({ statusCode: 400, code: 'VALIDATION_ERROR', message: 'End date must be after start date' });
    }

    const leave = await DeveloperLeave.create({
      developerId: req.user.userId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason || ''
    });

    await DeveloperActivity.create({
      developerId: req.user.userId,
      eventType: 'leave_requested',
      message: 'Leave request submitted.'
    });

    return sendSuccess(res, { data: leave });
  })
};
