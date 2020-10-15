import {ThunkAction} from 'redux-thunk';
import {Action} from 'redux';
import {ExtendedFirebaseInstance, FirebaseReducer, FirestoreReducer} from 'react-redux-firebase';
import {AuthState} from 'redux/modules/auth/types';
import {MessageState} from 'redux/modules/message/types';

export interface AppState {
  firebase: FirebaseReducer.Reducer;
  firestore: any;
  auth: AuthState;
  message: MessageState;
}

export type Thunk = ThunkAction<void, AppState, () => ExtendedFirebaseInstance, Action<string>>;
