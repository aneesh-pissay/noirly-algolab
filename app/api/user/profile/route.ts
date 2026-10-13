import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/src/server/auth/session';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/user/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    await connectDB();

    const user = await User.findById(userId).select('-password -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordExpiry');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      profile: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
        currentLevel: user.currentLevel,
        xp: user.xp,
        streak: user.streak,
        lastActiveDate: user.lastActiveDate,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Get profile error:', error);
    return NextResponse.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await requireUser();

    const { firstName, lastName, avatar, bio } = await request.json();

    await connectDB();

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(avatar !== undefined && { avatar }),
          ...(bio !== undefined && { bio }),
        },
      },
      { new: true, runValidators: true }
    ).select('-password -verificationToken -verificationTokenExpiry -resetPasswordToken -resetPasswordExpiry');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Profile updated successfully',
      profile: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
        bio: user.bio,
        currentLevel: user.currentLevel,
        xp: user.xp,
        streak: user.streak,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof Response) return error;
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
