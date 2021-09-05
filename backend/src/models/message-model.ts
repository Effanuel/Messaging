import {model, Schema} from 'mongoose';

const MessageSchema = new Schema({
  text: {type: String, required: true},
  userId: {type: String, required: true},
  username: {type: String, required: true},
  likes: {type: Number, required: true, default: 0, min: 0},
  createdAt: {type: Date, required: true, default: Date.now},
});

export interface IMessageSchema {
  text: string;
  likes: number;
  userId: string;
  username: string;
  createdAt: Date;
}

export const Message = model<IMessageSchema>('Message', MessageSchema);
