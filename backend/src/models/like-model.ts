import {model, Schema} from 'mongoose';

const LikeSchema = new Schema({
  userId: {type: String, required: true},
  messageId: {type: String, required: true},
});

interface ILikeSchema {
  userId: string;
  messageId: string;
}

export const Like = model<ILikeSchema>('Like', LikeSchema);
