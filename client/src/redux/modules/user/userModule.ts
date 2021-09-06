import {createReducer} from '@reduxjs/toolkit';
import axios from 'axios';
import {createThunk} from 'redux/helpers/thunks';
import {GET_USERS, UserState, VERIFY_USER} from './types';

export const verifyUser = createThunk<{userId: string; isVerified: boolean}>(
  VERIFY_USER,
  async ({userId, isVerified}) => {
    await axios.post('/user/verify', {userId, isVerified});
    return {userId, isVerified};
  },
);

type GetUsersProps = {searchFilter: string};
export const getUsers = createThunk<GetUsersProps>(GET_USERS, async ({searchFilter}) => {
  const response = await axios.post('/user/getUsers', {searchFilter});
  return response.data.users;
});

const defaultState = {
  users: [],
  loading: false,
};

export const userReducer = createReducer<UserState>(defaultState, (builder) =>
  builder
    .addCase(getUsers.pending, (state) => {
      state.loading = true;
    })
    .addCase(getUsers.fulfilled, (state, {payload}) => {
      state.loading = false;
      state.users = payload;
    })
    .addCase(getUsers.rejected, (state) => {
      state.loading = false;
    })
    .addCase(verifyUser.fulfilled, (state, {payload: {userId, isVerified}}) => {
      const userIndex = state.users.findIndex((user) => user.id === userId);
      const updatedUser = {...state.users[userIndex], isVerified};
      const updatedUsers = [...state.users.slice(0, userIndex), updatedUser, ...state.users.slice(userIndex + 1)];

      return {...state, users: updatedUsers};
    }),
);
