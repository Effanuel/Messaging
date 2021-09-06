import {User} from 'redux/helpers/selectorHelper';

export const GET_USERS = 'user/GET_USERS';

export const VERIFY_USER = 'user/VERIFY_USER';

export interface UserState {
  users: User[];
  loading: boolean;
}
