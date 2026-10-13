import User from '@/models/User';
import UserAchievement from '@/models/UserAchievement';
import UserCurriculumProgress from '@/models/UserCurriculumProgress';
import UserProgress from '@/models/UserProgress';
import UserSettings from '@/models/UserSettings';

export interface AlgoLabDeletionSummary {
  deleted: boolean;
}

/**
 * Deletes everything AlgoLab holds for a Noirly account: progress, settings,
 * achievements and the user record. Idempotent — a replayed notice finds
 * nothing and returns `{ deleted: false }`.
 */
export async function deleteAlgoLabAccountData(identitySub: string): Promise<AlgoLabDeletionSummary> {
  const user = await User.findOne({ identitySub }).select('_id').lean();
  if (!user) return { deleted: false };
  const userId = user._id;
  await Promise.all([
    UserCurriculumProgress.deleteMany({ userId }),
    UserProgress.deleteMany({ userId }),
    UserSettings.deleteMany({ userId }),
    UserAchievement.deleteMany({ userId }),
  ]);
  await User.deleteOne({ _id: userId });
  return { deleted: true };
}
