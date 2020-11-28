import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ExtendedFirebaseInstance, FirebaseReducer} from 'react-redux-firebase';
import {AuthState} from 'redux/modules/auth/types';
import {MessageState} from 'redux/modules/message/types';
import {UserState} from 'redux/modules/user/types';

export interface AppState {
  firebase: FirebaseReducer.Reducer;
  firestore: any;
  auth: AuthState;
  message: MessageState;
  user: UserState;
}

export type Thunk = ThunkAction<void, AppState, () => ExtendedFirebaseInstance, Action<string>>;
