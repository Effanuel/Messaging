import {createAction, createReducer} from '@reduxjs/toolkit';
import axios from 'axios';
import {createThunk} from 'redux/helpers/thunks';
import {AuthState, CLEAR_AUTH_STATE, SIGN_IN, SIGN_OUT, SIGN_UP} from './types';

type SignUpUserPayload = {username: string; password: string};
export const signUpUser = createThunk<SignUpUserPayload>(SIGN_UP, async ({username, password}) => {
  await axios.post('/user/signup', {username, password});
});

type SignInUserPayload = {username: string; password: string};
export const signInUser = createThunk<SignInUserPayload>(SIGN_IN, async ({username, password}) => {
  const response = await axios.post('/user/login', {username, password});
  const {id, isAdmin} = response.data;
  return {id, username, isAdmin};
});

export const signOutUser = createThunk<void>(SIGN_OUT, async () => {
  await axios.post('/user/logout');
});

export const clearAuthState = createAction(CLEAR_AUTH_STATE);

const defaultState = {
  error: '',
  loading: false,
  signedUpSuccessfully: false,
  authenticated: false,
  username: '',
  id: '',
  isAdmin: false,
};

export const authReducer = createReducer<AuthState>(defaultState, (builder) =>
  builder
    .addCase(clearAuthState, () => defaultState)
    .addCase(signUpUser.pending, () => {
      return {...defaultState, loading: true};
    })
    .addCase(signUpUser.fulfilled, () => {
      return {...defaultState, signedUpSuccessfully: true};
    })
    .addCase(signUpUser.rejected, (state, {payload}) => {
      return {...defaultState, error: payload ?? 'error'};
    })
    .addCase(signOutUser.fulfilled, () => defaultState)
    .addCase(signInUser.pending, () => {
      return {...defaultState, loading: true};
    })
    .addCase(signInUser.fulfilled, (state, {payload}: any) => {
      state.loading = false;
      state.error = '';
      state.signedUpSuccessfully = false;
      state.authenticated = true;
      state.username = payload.username;
      state.id = payload.id;
      state.isAdmin = payload.isAdmin;
    })
    .addCase(signInUser.rejected, (state, {payload}) => {
      return {...defaultState, error: payload ?? 'error'};
    }),
);
