import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {AuthState} from 'redux/modules/auth/types';
import {MessageState} from 'redux/modules/message/types';
import {UserState} from 'redux/modules/user/types';

export interface AppState {
  auth: AuthState;
  message: MessageState;
  user: UserState;
}

export type Thunk = ThunkAction<void, AppState, any, Action<string>>;
