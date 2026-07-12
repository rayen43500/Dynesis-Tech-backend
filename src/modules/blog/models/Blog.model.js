import mongoose from 'mongoose';

const LocalizedString = new mongoose.Schema(
  {
    en: { type: String, default: '' },
    fr: { type: String, default: '' }
  },
  { _id: false }
);

const BlogSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    excerpt: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    content: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    authorName: { type: String, default: '' },
    categories: { type: [String], default: [], index: true },
    tags: { type: [String], default: [] },
    coverImageUrl: { type: String, default: '' },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, default: null },
    seo: {
      metaTitle: { type: LocalizedString, default: () => ({ en: '', fr: '' }) },
      metaDescription: { type: LocalizedString, default: () => ({ en: '', fr: '' }) }
    }
  },
  { timestamps: true }
);

export const Blog = mongoose.model('Blog', BlogSchema);
