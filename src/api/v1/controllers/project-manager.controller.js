import { Project } from '../../../modules/projects/models/Project.model.js';
import { DeveloperTask } from '../../../modules/developer-work/models/DeveloperTask.model.js';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { sendSuccess } from '../../../shared/http/apiResponse.js';
import { parsePagination } from '../../../shared/http/pagination.js';

export const projectManagerController = {
  dashboard: asyncHandler(async (req, res) => {
    const pmId = req.user.userId;

    const projects = await Project.find({ projectManagerId: pmId }).sort({ updatedAt: -1 }).limit(8).lean();
    const projectIds = projects.map((p) => p._id);

    const [tasks, overdueTasks] = await Promise.all([
      DeveloperTask.find({ projectId: { $in: projectIds } }).sort({ dueDate: 1, updatedAt: -1 }).limit(12).lean(),
      DeveloperTask.find({
        projectId: { $in: projectIds },
        status: { $nin: ['done', 'canceled'] },
        dueDate: { $lt: new Date() }
      })
        .sort({ dueDate: 1 })
        .limit(6)
        .lean()
    ]);

    const activeProjects = projects.filter((p) => p.status === 'active').length;

    return sendSuccess(res, {
      data: {
        stats: {
          totalProjects: projects.length,
          activeProjects,
          assignedTasks: tasks.length,
          overdueTasks: overdueTasks.length
        },
        projects,
        tasks,
        overdueTasks
      }
    });
  }),

  projects: asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = { projectManagerId: req.user.userId };
    if (req.query.status) filter.status = String(req.query.status);

    const [items, total] = await Promise.all([
      Project.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit).lean(),
      Project.countDocuments(filter)
    ]);

    return sendSuccess(res, { data: items, meta: { page, limit, total } });
  })
};
