import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const PreviousCompanySchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    logo: { type: String, default: '' }
  },
  { _id: false }
);

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, default: '' },
    role: { type: String, default: '' },
    startYear: { type: Number, default: null },
    endYear: { type: mongoose.Schema.Types.Mixed, default: null },
    bullets: { type: [String], default: [] },
    technologies: { type: [String], default: [] }
  },
  { _id: true }
);

const EducationSchema = new mongoose.Schema(
  {
    school: { type: String, default: '' },
    degree: { type: String, default: '' },
    year: { type: Number, default: null }
  },
  { _id: false }
);

const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, default: '' },
    years: { type: Number, default: 0 }
  },
  { _id: false }
);

const PortfolioSchema = new mongoose.Schema(
  {
    title: { type: String, default: '' },
    description: { type: String, default: '' },
    overview: { type: String, default: '' },
    brief: { type: String, default: '' },
    challenges: { type: String, default: '' },
    solutions: { type: String, default: '' },
    outcomes: { type: String, default: '' },
    technologies: { type: [String], default: [] },
    images: { type: [String], default: [] },
    category: { type: String, default: '' }
  },
  { timestamps: true }
);

const DeveloperImage = new mongoose.Schema(
  {
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaAsset', default: null },
    cloudinaryPublicId: { type: String, default: '' },
    secureUrl: { type: String, default: '' }
  },
  { _id: false }
);

const DeveloperProfileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, index: true },
    roleTitle: { type: String, default: '' },
    location: { type: String, default: '' },
    biography: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    photo: { type: String, default: '' },
    availability: { type: Boolean, default: true },
    memberSince: { type: Date, default: null },
    verifiedBadge: { type: Boolean, default: true, index: true },

    expertiseTags: { type: [String], default: [] },
    previousCompanies: { type: [PreviousCompanySchema], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    skills: { type: [SkillSchema], default: [] },
    portfolio: { type: [PortfolioSchema], default: [] },

    yearsOfExperience: { type: Number, default: null },
    availabilityStatus: {
      type: String,
      enum: ['available', 'limited', 'unavailable', 'unknown'],
      default: 'available',
      index: true
    },
    highlightedExpertise: { type: String, default: '' },
    skillsLegacy: { type: [String], default: [] },
    technologies: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    ordering: { type: Number, default: 0, index: true },
    visible: { type: Boolean, default: true, index: true },
    profileImage: { type: DeveloperImage, default: () => ({}) },
    homepageAccent: {
      accentColor: { type: String, default: '' },
      glowColor: { type: String, default: '' },
      gradientTheme: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

DeveloperProfileSchema.index({ visible: 1, ordering: 1 });

export const DeveloperProfile = mongoose.model('DeveloperProfile', DeveloperProfileSchema);
