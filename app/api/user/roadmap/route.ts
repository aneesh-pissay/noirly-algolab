import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/src/server/auth/session';
import connectDB from '@/lib/mongodb';
import UserProgress from '@/models/UserProgress';

// GET /api/user/roadmap - Get learning roadmap with user's progress
export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    await connectDB();

    // Fetch all user progress records
    const progressRecords = await UserProgress.find({ userId: userId }).lean();

    // Create a map for quick lookup
    const progressMap = new Map(
      progressRecords.map((record) => [
        `${record.levelId}-${record.topicSlug}`,
        record
      ])
    );

    // Import the roadmap structure (we'll need to adjust this)
    const { learningRoadmap } = await import('@/app/data/roadmap');

    // Enhance roadmap with real progress data
    const enhancedRoadmap = learningRoadmap.map((level) => {
      const enhancedTopics = level.topics.map((topic) => {
        const key = `${level.id}-${topic.id}`;
        const progress = progressMap.get(key);
        
        return {
          ...topic,
          completed: progress?.status === 'completed' || false,
          progress: progress?.progress || 0,
          timeSpent: progress?.timeSpent || 0,
          score: progress?.score,
          lastAttempt: progress?.updatedAt,
        };
      });

      // Calculate level status based on topic completion
      const completedCount = enhancedTopics.filter(t => t.completed).length;
      const totalCount = enhancedTopics.length;
      const allCompleted = completedCount === totalCount;
      const someCompleted = completedCount > 0;

      // Determine if level is unlocked (first level or previous level completed)
      const levelIndex = learningRoadmap.indexOf(level);
      const isFirstLevel = levelIndex === 0;
      const previousLevel = levelIndex > 0 ? learningRoadmap[levelIndex - 1] : null;
      
      let previousLevelCompleted = true;
      if (previousLevel) {
        const prevTopics = previousLevel.topics.map((topic) => {
          const key = `${previousLevel.id}-${topic.id}`;
          const progress = progressMap.get(key);
          return progress?.status === 'completed';
        });
        previousLevelCompleted = prevTopics.every(c => c);
      }

      const isUnlocked = isFirstLevel || previousLevelCompleted;

      return {
        ...level,
        topics: enhancedTopics,
        status: !isUnlocked ? 'locked' : allCompleted ? 'completed' : someCompleted ? 'in-progress' : 'not-started',
        completedCount,
        totalCount,
        progressPercentage: Math.round((completedCount / totalCount) * 100),
      };
    });

    return NextResponse.json({
      roadmap: enhancedRoadmap,
      stats: {
        totalLevels: enhancedRoadmap.length,
        completedLevels: enhancedRoadmap.filter(l => l.status === 'completed').length,
        inProgressLevels: enhancedRoadmap.filter(l => l.status === 'in-progress').length,
        totalTopics: enhancedRoadmap.reduce((sum, l) => sum + l.totalCount, 0),
        completedTopics: enhancedRoadmap.reduce((sum, l) => sum + l.completedCount, 0),
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Error fetching roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roadmap' },
      { status: 500 }
    );
  }
}
