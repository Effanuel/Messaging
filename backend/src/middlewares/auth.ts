import {RequestHandler} from 'express';
import jwt from 'jsonwebtoken';
import {User} from '../models/user-model';

export async function getAuthenticatedUser(req: Parameters<RequestHandler>['0']) {
  const token =
    req.header('Authorization')?.replace('Bearer ', '') ||
    req.body.token ||
    req.query.token ||
    req.headers['authorization'] ||
    req.cookies?.jwt;

  if (!token) return null;

  const decoded = jwt.verify(token, process.env.TOKEN_KEY!);
  //@ts-ignore
  const user = await User.findOne({_id: decoded._id, token});
  return user;
}

export const auth: RequestHandler = async (req, res, next) => {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      throw new Error('Authenticate');
    }
    //@ts-ignore
    req.user = user;
    next();
  } catch (error) {
    console.log(' STATUSUS', error);
    return res.status(401).send({error: 'Authenticate'});
  }
};
