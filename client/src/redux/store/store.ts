import {combineReducers} from 'redux';
import {AppState} from 'redux/models/state';
import {configureStore} from '@reduxjs/toolkit';
import {authReducer} from 'redux/modules/auth/authModule';
import {messageReducer} from 'redux/modules/message/messageModule';
import {userReducer} from 'redux/modules/user/userModule';

const rootReducer = combineReducers<AppState>({
  auth: authReducer,
  message: messageReducer,
  user: userReducer,
});

export function createStore(preloadedState: Partial<AppState> = {}) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}).concat([]),
    preloadedState,
  });
}
