import mongoose from 'mongoose';

export const FEEDBACK_CATEGORIES = [
  'Product',
  'Support',
  'Billing',
  'Feature Request',
  'UI/UX',
  'Other',
] as const;

export type FeedbackCategory = typeof FEEDBACK_CATEGORIES[number];

export interface FeedbackDocument extends mongoose.Document {
  name: string;
  email?: string;
  category: FeedbackCategory;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema = new mongoose.Schema<FeedbackDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: FEEDBACK_CATEGORIES,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },
  },
  { timestamps: true }
);

FeedbackSchema.index({ createdAt: -1 });
FeedbackSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model<FeedbackDocument>('Feedback', FeedbackSchema);
