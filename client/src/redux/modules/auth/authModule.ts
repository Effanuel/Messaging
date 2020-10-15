import {createReducer} from '@reduxjs/toolkit';
import {createThunk} from 'redux/helpers/thunks';
import {AuthState, SIGN_IN, SIGN_OUT, SIGN_UP} from './types';

type SignUpUserPayload = {username: string; email: string; password: string};
export const signUpUser = createThunk<SignUpUserPayload>(SIGN_UP, async (payload, firebase) => {
  const {username, email, password} = payload;
  const auth = firebase().auth();

  const authResponse = await auth.createUserWithEmailAndPassword(email, password);
  await auth.signOut();
  return await firebase()
    .firestore()
    .collection('users')
    .doc(authResponse.user?.uid)
    .set({username, email, isVerified: false, following: [], followerCount: 0, postCount: 0});
});

type SignInUserPayload = {email: string; password: string};
export const signInUser = createThunk<SignInUserPayload>(SIGN_IN, async ({email, password}, firebase) => {
  await firebase().auth().signInWithEmailAndPassword(email, password);
});

export const signOutUser = createThunk(SIGN_OUT, async (payload, firebase) => {
  await firebase().auth().signOut();
});

const defaultState = {
  error: '',
  loading: false,
  signedUpSuccessfully: false,
};

export const authReducer = createReducer<AuthState>(defaultState, (builder) =>
  builder
    .addCase(signUpUser.pending, (state) => {
      return {...defaultState, loading: true};
    })
    .addCase(signUpUser.fulfilled, () => {
      return {...defaultState, signedUpSuccessfully: true};
    })
    .addCase(signUpUser.rejected, (state, {payload}) => {
      return {...defaultState, error: payload ?? 'error'};
    })
    .addCase(signOutUser.fulfilled, () => defaultState)
    .addCase(signInUser.pending, (state) => {
      return {...defaultState, loading: true};
    })
    .addCase(signInUser.fulfilled, () => defaultState)
    .addCase(signInUser.rejected, (state, {payload}) => {
      return {...defaultState, error: payload ?? 'error'};
    }),
);