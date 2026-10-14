import mongoose, { Schema, Document, Model } from 'mongoose';

/** The latest quiz this learner passed, graded on the server (POST /api/quiz/submit). */
export interface PassedQuizAttempt {
  lessonId: string;
  score: number;
  templated: boolean;
  passedAt: Date;
}

/** A missed quiz question waiting for spaced review (spec F8). */
export interface ReviewQueueItem {
  lessonId: string;
  questionId: string;
  stage: number;
  dueAt: Date;
  missedAt: Date;
}

export interface IUserCurriculumProgress extends Document {
  userId: mongoose.Types.ObjectId;
  completedLessons: string[];
  unlockedLessons: string[];
  unlockedTiers: string[];
  unlockedTopics: string[];
  currentLesson: string | null;
  recentlyCompleted: string[];
  /** Additive (spec 5.1): /api/progress/complete requires a passed attempt for the lesson. */
  lastPassedAttempt?: PassedQuizAttempt | null;
  /** Additive (spec F8): missed questions and when to ask them again. */
  reviewQueue?: ReviewQueueItem[];
  updatedAt: Date;
  createdAt: Date;
}

const UserCurriculumProgressSchema = new Schema<IUserCurriculumProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    completedLessons: {
      type: [String],
      default: [],
    },
    unlockedLessons: {
      type: [String],
      default: [],
    },
    unlockedTiers: {
      type: [String],
      default: [],
    },
    unlockedTopics: {
      type: [String],
      default: [],
    },
    currentLesson: {
      type: String,
      default: null,
    },
    recentlyCompleted: {
      type: [String],
      default: [],
    },
    lastPassedAttempt: {
      type: new Schema<PassedQuizAttempt>(
        {
          lessonId: { type: String, required: true },
          score: { type: Number, required: true, min: 0, max: 100 },
          templated: { type: Boolean, default: false },
          passedAt: { type: Date, required: true },
        },
        { _id: false },
      ),
      default: null,
    },
    reviewQueue: {
      type: [
        new Schema<ReviewQueueItem>(
          {
            lessonId: { type: String, required: true },
            questionId: { type: String, required: true },
            stage: { type: Number, default: 0, min: 0, max: 2 },
            dueAt: { type: Date, required: true },
            missedAt: { type: Date, required: true },
          },
          { _id: false },
        ),
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'user_curriculum_progress',
  }
);

const UserCurriculumProgress: Model<IUserCurriculumProgress> =
  mongoose.models.UserCurriculumProgress ||
  mongoose.model<IUserCurriculumProgress>('UserCurriculumProgress', UserCurriculumProgressSchema);

export default UserCurriculumProgress;
