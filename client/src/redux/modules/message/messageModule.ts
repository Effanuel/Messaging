import {createAction, createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import axios from 'axios';
import {createThunk, ThunkApiConfig} from 'redux/helpers/thunks';
import {
  CLEAR_MESSAGES,
  CREATE_MESSAGE,
  FOLLOW_USER,
  GET_MESSAGES,
  GET_PROFILE,
  LIKE_MESSAGE,
  Message,
  MessageState,
  UNFOLLOW_USER,
  UNLIKE_MESSAGE,
} from './types';

export const PAGE_LIMIT = 5;

export const clearMessages = createAction(CLEAR_MESSAGES);

export const likeMessage = createThunk<{messageId: string}>(LIKE_MESSAGE, async ({messageId}) => {
  await axios.post('/message/like', {messageId});
  return messageId;
});

export const unlikeMessage = createThunk<{messageId: string}>(UNLIKE_MESSAGE, async ({messageId}) => {
  await axios.post('/message/unlike', {messageId});
  return messageId;
});

type CreateMessageProps = {text: string};
export const createMessage = createThunk<CreateMessageProps>(CREATE_MESSAGE, async (payload) => {
  const response = await axios.post('/message/create', {text: payload.text});
  const {createdAt, likes, text, userId, username} = response.data.message;
  return {createdAt, likes, text, userId, username} as Message;
});

export const followUser = createThunk<{userId: string}>(FOLLOW_USER, async ({userId}) => {
  await axios.post('/user/follow', {userId});
});

export const unfollowUser = createThunk<{userId: string}>(UNFOLLOW_USER, async ({userId}) => {
  await axios.post('/user/unfollow', {userId});
});

export const getProfile = createThunk<{userId: string}>(GET_PROFILE, async (payload) => {
  const response = await axios.post('/user/getProfile', {userId: payload.userId});
  return response.data.profile;
});

type GetMessagesProps = {
  type: 'initial' | 'forward' | 'backward';
  userId: string;
  tagNames?: string[];
  query: 'userMessages' | 'followedUsersMessages' | 'messagesByTag';
};
export const getMessages = createAsyncThunk<any, GetMessagesProps, ThunkApiConfig>(
  GET_MESSAGES,
  async ({type, userId, query, tagNames}, {rejectWithValue}) => {
    try {
      switch (type) {
        case 'initial': {
          if (query === 'userMessages') {
            const result = await axios.post('/message/userMessages', {userId});
            return {messages: result.data.messages};
          }
          if (query === 'followedUsersMessages') {
            const result = await axios.get('/message/followerMessages');
            return {messages: result.data.messages};
          }
          if (query === 'messagesByTag') {
            const result = await axios.post('/message/messagesByTags', {tagNames});
            return {messages: result.data.messages};
          }
        }
      }
      return undefined;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.error);
    }
  },
);

const defaultState = {
  userId: '',
  messages: [],
  profile: {userId: '', isFollowing: false, name: '', followerCount: 0, isVerified: false},
  loading: false,
  currentPage: 0,
  error: '',
};

export const messageReducer = createReducer<MessageState>(defaultState, (builder) =>
  builder
    .addCase(createMessage.pending, (state) => {
      return {...state, loading: true, error: ''};
    })
    .addCase(createMessage.fulfilled, (state, {payload}) => {
      return {...state, loading: false, messages: [payload, ...state.messages]};
    })
    .addCase(createMessage.rejected, (state, {payload}) => {
      return {...state, loading: false, error: payload ?? 'Error'};
    })
    .addCase(getMessages.pending, (state) => {
      return {...state, loading: true, error: ''};
    })
    .addCase(getMessages.fulfilled, (state, {payload: {userId, messages, movePage = 0, likes}}) => {
      state.messages = messages;
      state.loading = false;
      state.error = '';
      //   if (state.userId !== userId || state.userId === '') {
      //     return {...state, messages, likes, userId, loading: false, error: '', currentPage: 0};
      //   } else {
      // return messages.length === 0
      //   ? {...state, messages: [], loading: false, error: ''}
      //   : {...state, messages, likes, userId, currentPage: state.currentPage + movePage};
      //   }
    })
    .addCase(likeMessage.pending, (state) => {
      state.loading = true;
      state.error = '';
    })
    .addCase(likeMessage.fulfilled, (state, {payload}) => {
      const messageIndex = state.messages.findIndex((message) => message._id === payload);
      const updatedMessage = {
        ...state.messages[messageIndex],
        isLiked: true,
        likes: (state.messages[messageIndex]?.likes ?? 0) + 1,
      };
      const updatedMessages = [
        ...state.messages.slice(0, messageIndex),
        updatedMessage,
        ...state.messages.slice(messageIndex + 1),
      ];

      return {...state, loading: false, error: '', messages: updatedMessages};
    })
    .addCase(unlikeMessage.fulfilled, (state, {payload}) => {
      const messageIndex = state.messages.findIndex((message) => message._id === payload);
      const updatedMessage = {
        ...state.messages[messageIndex],
        isLiked: false,
        likes: (state.messages[messageIndex]?.likes ?? 0) - 1,
      };
      const updatedMessages = [
        ...state.messages.slice(0, messageIndex),
        updatedMessage,
        ...state.messages.slice(messageIndex + 1),
      ];

      return {...state, loading: true, error: '', messages: updatedMessages};
    })
    .addCase(getProfile.fulfilled, (state, {payload}) => {
      return {...state, profile: payload};
    })
    .addCase(followUser.fulfilled, (state) => {
      return {...state, profile: {...state.profile, isFollowing: true, followerCount: state.profile.followerCount + 1}};
    })
    .addCase(unfollowUser.fulfilled, (state) => {
      return {
        ...state,
        profile: {...state.profile, isFollowing: false, followerCount: state.profile.followerCount - 1},
      };
    })
    .addCase(clearMessages, (state) => {
      return {...state, messages: []};
    }),
);
