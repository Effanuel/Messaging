import {model, Schema} from 'mongoose';

const FollowSchema = new Schema({
  userId: {type: String, required: true},
  followerId: {type: String, required: true},
});

export interface IFollowSchema {
  userId: string;
  followerId: string;
}

export const Follow = model<IFollowSchema>('Follow', FollowSchema);
