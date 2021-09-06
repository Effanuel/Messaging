import {RequestHandler} from 'express';
import {Document} from 'mongoose';
import {IUserSchema} from './models/user-model';

type AuthRequestHandler = (
  req: Parameters<RequestHandler>['0'] & {user: Document<any, any, IUserSchema> & IUserSchema},
  res: Parameters<RequestHandler>['1'],
  next: Parameters<RequestHandler>['2'],
) => any;

export const asyncHandler = (fn: AuthRequestHandler): RequestHandler => {
  return (req, res, next) => Promise.resolve(fn(req as any, res, next)).catch(next);
};
