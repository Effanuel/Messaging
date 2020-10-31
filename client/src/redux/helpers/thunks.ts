import {AsyncThunk, createAsyncThunk} from '@reduxjs/toolkit';
import {ExtendedFirebaseInstance} from 'react-redux-firebase';
import {AppState} from 'redux/models/state';

interface ThunkApiConfig {
  rejected: string;
  extra: () => ExtendedFirebaseInstance;
  rejectValue: string;
  state: AppState;
}

export function createThunk<P, Returned = any>(
  actionName: any,
  request: (payload: P, firebase: () => ExtendedFirebaseInstance) => Promise<any>,
): AsyncThunk<Returned, P, ThunkApiConfig> {
  return createAsyncThunk<Returned, P, ThunkApiConfig>(
    actionName,
    async (payload: P, {rejectWithValue, extra: firebase}) => {
      try {
        return await request(payload, firebase);
      } catch (err) {
        const errorMessage: string = errorHandler?.[err?.code] ?? 'error';
        return rejectWithValue(errorMessage);
      }
    },
  );
}

const errorHandler: {[key: string]: string} = {
  'auth/user-not-found': 'Email or password is incorrect.',
  'auth/wrong-password': 'Email or password is incorrect.',
  'auth/invalid-email': 'Email is invalid.',
  'auth/email-already-in-use': 'Email already in use.',
  'auth/weak-password': 'Password should be atleast 6 characters.',
  'auth/network-request-failed': 'Network error.',
  'auth/too-many-requests': 'Too many failed attempts.',
  'auth/username-exists': 'Username is already in use.',
};
