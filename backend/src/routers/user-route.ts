import {Router} from 'express';
import jwt from 'jsonwebtoken';
import {auth, getAuthenticatedUser} from '../middlewares/auth';
import {Follow} from '../models/follow-model';
import {Message} from '../models/message-model';
import {IUserSchema, User} from '../models/user-model';
import {asyncHandler} from '../utils';

const toUser = (user: IUserSchema) => ({
  username: user.username,
  isVerified: user.isVerified,
  followerCount: user.followerCount,
  isAdmin: user.isAdmin,
});

export function UserRouter() {
  return Router()
    .post('/signup', async (req, res) => {
      const {username, password} = req.body;
      const user = new User({username, password});

      try {
        const foundUser = await User.findOne({username});

        if (foundUser) {
          throw new Error('Username is already in use.');
        }
        await user.save();
        return res.status(200).json({success: true});
      } catch ({message}) {
        return res.status(400).json({success: false, error: message});
      }
    })
    .post(
      '/login',
      asyncHandler(async (req, res) => {
        const {username, password} = req.body;
        const user = await User.findOne({username});

        if (!user || password !== user.password) {
          throw new Error('Unable to login');
        }

        const token = jwt.sign({_id: user._id.toString()}, process.env.TOKEN_KEY!, {expiresIn: '2h'});
        await user.updateOne({token});

        res.cookie('jwt', token, {httpOnly: true, maxAge: 60 * 1000});
        return res.status(200).json({success: true, id: user.id, username: user.username});
      }),
    )
    .post(
      '/logout',
      auth,
      asyncHandler(async (req, res) => {
        const {id} = req.user;

        await User.findByIdAndUpdate(id, {token: ''});

        res.cookie('jwt', '', {maxAge: 1});
        res.status(200).send({success: true});
      }),
    )
    .post(
      '/getUsers',
      //   auth,
      asyncHandler(async (req, res) => {
        const {searchFilter} = req.body;
        const users = await User.find({username: {$gte: searchFilter, $lt: searchFilter + 'z'}})
          .limit(5)
          .lean();
        return res.status(200).json({users: users.map(toUser)});
      }),
    )
    .post(
      '/verify',
      asyncHandler(async (req, res) => {
        const {userId, isVerified} = req.body;
        await User.findByIdAndUpdate(userId, {isVerified});
        return res.status(200).json({success: true});
      }),
    )
    .post(
      '/getProfile',
      asyncHandler(async (req, res) => {
        const user = await User.findById(req.body.userId).lean();
        const authenticatedUser = await getAuthenticatedUser(req);
        const follow = await Follow.findOne({userId: req.body.userId, followerId: authenticatedUser?.id});

        if (!user) {
          throw new Error('User not found');
        }

        return res.status(200).json({profile: {...toUser(user), isFollowing: Boolean(follow)}});
      }),
    )
    .post(
      '/follow',
      auth,
      asyncHandler(async (req, res) => {
        const follow = new Follow({userId: req.body.userId, followerId: req.user.id});
        await follow.save();
        await User.findByIdAndUpdate(req.body.userId, {$inc: {followerCount: 1}});

        return res.status(200).json({success: true});
      }),
    )
    .post(
      '/unfollow',
      auth,
      asyncHandler(async (req, res) => {
        await Follow.findOneAndDelete({userId: req.body.userId, followerId: req.user.id});
        await User.findByIdAndUpdate(req.body.userId, {$inc: {followerCount: -1}});

        return res.status(200).json({success: true});
      }),
    );
}
