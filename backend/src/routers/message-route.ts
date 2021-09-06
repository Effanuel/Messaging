import {Router} from 'express';
import {FilterQuery} from 'mongoose';
import {auth, getAuthenticatedUser} from '../middlewares/auth';
import {Follow} from '../models/follow-model';
import {Like} from '../models/like-model';
import {Message, IMessageSchema} from '../models/message-model';
import {asyncHandler} from '../utils';

function getTags(text: string): string[] {
  return (text.match(/#\w+/g) ?? []).map((tag) => tag.replace(/#/gm, ''));
}

async function findLikedMessages(filter: FilterQuery<IMessageSchema>, likerId?: string) {
  const messages = await Message.find(filter) // TODO add followers list
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
  const create = asyncHandler(async (req, res) => {
    const {username, id} = req.user;
    const message = new Message({text: req.body.text, username, userId: id, tags: getTags(req.body.text)});
    const saved = await message.save();
    return res.status(200).json({success: true, message: saved});
  });

  const userMessages = asyncHandler(async (req, res) => {
    const {userId} = req.body;
    const authenticatedUser = await getAuthenticatedUser(req);
    const messages = await findLikedMessages({userId: {$in: [userId]}}, authenticatedUser?.id);
    return res.status(200).json({messages});
  });

  const messagesByTags = asyncHandler(async (req, res) => {
    const {tagNames} = req.body;
    const authenticatedUser = await getAuthenticatedUser(req);
    const messages = await findLikedMessages({tags: {$all: tagNames}}, authenticatedUser?.id);
    return res.status(200).json({messages});
  });

  const followerMessages = asyncHandler(async (req, res) => {
    const {id} = req.user;
    const follows = await Follow.find({followerId: id}).lean();
    const followsIds = follows.map((follow) => follow.userId);
    const messages = await findLikedMessages({userId: {$in: [id, ...followsIds]}}, id);
    return res.status(200).json({messages});
  });

  const like = asyncHandler(async (req, res) => {
    const like = await Like.create({userId: req.user.id, messageId: req.body.messageId});
    await like.save();
    await Message.findByIdAndUpdate(req.body.messageId, {$inc: {likes: 1}});
    return res.status(200).json({success: true});
  });

  const unlike = asyncHandler(async (req, res) => {
    await Message.findByIdAndUpdate(req.body.messageId, {$inc: {likes: -1}});
    await Like.findOneAndDelete({messageId: req.body.messageId});
    return res.status(200).json({success: true});
  });

  return Router()
    .post('/create', auth, create)
    .post('/userMessages', userMessages)
    .post('/messagesByTags', messagesByTags)
    .get('/followerMessages', auth, followerMessages)
    .post('/like', auth, like)
    .post('/unlike', auth, unlike);
}
