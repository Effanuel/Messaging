import {combineReducers} from 'redux';
import {firebaseReducer, getFirebase} from 'react-redux-firebase';
import {firestoreReducer} from 'redux-firestore';
import {AppState} from 'redux/models/state';
import {configureStore, getDefaultMiddleware} from '@reduxjs/toolkit';
import {authReducer} from 'redux/modules/auth/authModule';
import {messageReducer} from 'redux/modules/message/messageModule';
import {userReducer} from 'redux/modules/user/userModule';

const rootReducer = combineReducers<AppState>({
  firebase: firebaseReducer,
  auth: authReducer,
  message: messageReducer,
  firestore: firestoreReducer,
  user: userReducer,
});

function createStore(preloadedState: Partial<AppState> = {}) {
  return configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware({
      thunk: {extraArgument: getFirebase},
      serializableCheck: false,
    }).concat([]),
    preloadedState,
  });
}

export const store = createStore();

export const dispatch = store.dispatch;
