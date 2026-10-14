import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  /** Legacy: set only for accounts created before Noirly Identity SSO. */
  password?: string;
  isVerified: boolean;

  /** Noirly Identity `sub`. Set on first SSO sign-in; never changes. */
  identitySub?: string;
  
  // Profile fields
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  
  // Learning progress
  currentLevel: number;
  xp: number;
  streak: number;
  lastActiveDate?: Date;
  
  // User role
  role: 'user' | 'admin' | 'instructor';
  
  // Legacy authentication tokens (unused since Noirly Identity SSO)
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      // Identity has already validated the address; this only rejects
      // obvious garbage (the old pattern refused TLDs longer than 3 letters).
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    },
    // Legacy password hash. Accounts created through Noirly Identity have none.
    password: {
      type: String,
    },
    identitySub: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    
    // Profile fields
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },
    
    // Learning progress
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
      max: 17,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    streak: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastActiveDate: {
      type: Date,
    },
    
    // User role
    role: {
      type: String,
      enum: ['user', 'admin', 'instructor'],
      default: 'user',
    },
    
    // Authentication tokens
    verificationToken: {
      type: String,
    },
    verificationTokenExpiry: {
      type: Date,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation in development
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
