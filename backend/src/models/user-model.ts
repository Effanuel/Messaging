import {model, Schema} from 'mongoose';

const UserSchema = new Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  isVerified: {type: Boolean, required: true, default: false},
  followerCount: {type: Number, required: true, default: 0, min: 0},
  isAdmin: {type: Boolean, required: true, default: false},
  token: {type: String},
});

export interface IUserSchema {
  username: string;
  password: string;
  isVerified?: boolean;
  followerCount?: number;
  isAdmin?: boolean;
  token?: string;
}

export const User = model<IUserSchema>('User', UserSchema);
