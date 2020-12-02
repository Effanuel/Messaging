import {createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {createThunk, errorHandler, ThunkApiConfig} from 'redux/helpers/thunks';
import {GET_USERS, UserState, VERIFY_USER} from './types';

export const verifyUser = createThunk<{userId: string; isVerified: boolean}>(
  VERIFY_USER,
  async ({userId, isVerified}, firebase) => {
    const firestore = firebase().firestore();
    await firestore.collection('users').doc(userId).update({isVerified});
    return {userId, isVerified};
  },
);

type GetUsersProps = {searchFilter: string};
export const getUsers = createAsyncThunk<any, GetUsersProps, ThunkApiConfig>(
  GET_USERS,
  async ({searchFilter}, {rejectWithValue, extra: firebase}) => {
    const firestore = firebase().firestore();
    try {
      const snapshot = await firestore
        .collection('users')
        .where('username', '>=', searchFilter)
        .where('username', '<', `${searchFilter}z`)
        .limit(20)
        .get();
      return snapshot.docs?.map((doc) => ({...doc.data(), id: doc.id}));
    } catch (err) {
      const errorMessage: string = errorHandler?.[err?.code] ?? 'error';
      return rejectWithValue(errorMessage);
    }
  },
);

const defaultState = {
  users: [],
};

export const userReducer = createReducer<UserState>(defaultState, (builder) =>
  builder
    .addCase(getUsers.pending, (state) => {
      return {...state};
    })
    .addCase(getUsers.fulfilled, (state, {payload}) => {
      return {...state, users: payload};
    })
    .addCase(verifyUser.fulfilled, (state, {payload: {userId, isVerified}}) => {
      const userIndex = state.users.findIndex((user) => user.id === userId);
      const updatedUser = {...state.users[userIndex], isVerified};
      const updatedUsers = [...state.users.slice(0, userIndex), updatedUser, ...state.users.slice(userIndex + 1)];

      return {...state, users: updatedUsers};
    }),
);
