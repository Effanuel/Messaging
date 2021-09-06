import {RequestHandler, Router} from 'express';
import {model, Schema, Document} from 'mongoose';
import {auth, getAuthenticatedUser} from '../middlewares/auth';
import {Follow} from '../models/follow-model';
import {Like} from '../models/like-model';
import {Message, IMessageSchema} from '../models/message-model';
import {IUserSchema, User} from '../models/user-model';
import {asyncHandler} from '../utils';

async function findLikedMessages(userIds: string[], likerId?: string) {
  const messages = await Message.find({userId: {$in: userIds}}) // TODO add followers list
    .sort({createdAt: -1})
    .limit(5);

  if (likerId) {
    const likes = await Like.find({messageId: {$in: messages.map((message) => message.id)}, userId: likerId}).lean();
    const usersLiked = likes.map((like) => like.messageId);
    return messages.map((message) => ({...message.toObject(), isLiked: usersLiked.includes(message.id)}));
  }

  return messages;
}

export function MessageRouter() {
  return Router()
    .post(
      '/create',
      auth,
      asyncHandler(async (req, res) => {
        const {username, id} = req.user;
        const message = new Message({text: req.body.text, username, userId: id});

        const saved = await message.save();

        return res.status(200).json({success: true, message: saved});
      }),
    )
    .post(
      '/userMessages',
      asyncHandler(async (req, res) => {
        const {userId} = req.body;
        const authenticatedUser = await getAuthenticatedUser(req);
        const messages = await findLikedMessages([userId], authenticatedUser?.id);

        return res.status(200).json({messages});
      }),
    )
    .get(
      '/followerMessages',
      auth,
      asyncHandler(async (req, res) => {
        const {id} = req.user;
        const follows = await Follow.find({followerId: id}).lean();

        const followsIds = follows.map((follow) => follow.userId);
        const messages = await findLikedMessages([id, ...followsIds], id);

        return res.status(200).json({messages});
      }),
    )
    .post(
      '/like',
      auth,
      asyncHandler(async (req, res) => {
        const like = await Like.create({userId: req.user.id, messageId: req.body.messageId});
        await like.save();
        await Message.findByIdAndUpdate(req.body.messageId, {$inc: {likes: 1}});

        return res.status(200).json({success: true});
      }),
    )
    .post(
      '/unlike',
      auth,
      asyncHandler(async (req, res) => {
        await Message.findByIdAndUpdate(req.body.messageId, {$inc: {likes: -1}});
        await Like.findOneAndDelete({messageId: req.body.messageId});

        return res.status(200).json({success: true});
      }),
    );
}
