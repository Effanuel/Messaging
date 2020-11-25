import {createAction, createReducer} from '@reduxjs/toolkit';
import {ExtendedFirestoreInstance} from 'react-redux-firebase';
import {createThunk} from 'redux/helpers/thunks';
import {AuthState, CLEAR_AUTH_STATE, SIGN_IN, SIGN_OUT, SIGN_UP} from './types';

async function throwIfUsernameExists(firestore: () => ExtendedFirestoreInstance, username: string) {
  const snapshot = await firestore().collection('users').where('username', '==', username).get();
  const usernameExists = Boolean(snapshot.docs.map((doc) => doc.data())?.length);
  if (usernameExists) {
    throw {code: 'auth/username-exists'};
  }
}

type SignUpUserPayload = {username: string; email: string; password: string};
export const signUpUser = createThunk<SignUpUserPayload>(SIGN_UP, async (payload, firebase) => {
  const {username, email, password} = payload;
  const {auth, firestore} = firebase();

  await throwIfUsernameExists(firestore, payload.username);

  const authResponse = await auth().createUserWithEmailAndPassword(email, password);
  await auth().signOut();
  return await firestore()
    .collection('users')
    .doc(authResponse.user?.uid)
    .set({username, email, isVerified: false, followerCount: 0});
});

type SignInUserPayload = {email: string; password: string};
export const signInUser = createThunk<SignInUserPayload>(SIGN_IN, async ({email, password}, firebase) => {
  await firebase().auth().signInWithEmailAndPassword(email, password);
});

export const signOutUser = createThunk(SIGN_OUT, async (payload, firebase) => {
  await firebase().auth().signOut();
});

export const clearAuthState = createAction(CLEAR_AUTH_STATE);

const defaultState = {
  error: '',
  loading: false,
  signedUpSuccessfully: false,
};

export const authReducer = createReducer<AuthState>(defaultState, (builder) =>
  builder
    .addCase(clearAuthState, () => defaultState)
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
