import {createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {createThunk, ThunkApiConfig} from 'redux/helpers/thunks';
import {CREATE_MESSAGE, GET_MESSAGES, MessageState} from './types';

interface CreateMessageProps {
  text: string;
  username: string;
  userId: string;
}

export const createMessage = createThunk<CreateMessageProps>(CREATE_MESSAGE, async (payload, firebase) => {
  const {username, text, userId} = payload;
  const message = {text, username, userId, createdAt: new Date()};
  return await firebase().firestore().collection('messages').add(message);
});

interface GetMessagesProps {
  type: 'initial' | 'forward' | 'backward';
  userId: string;
}

export const getMessages = createAsyncThunk<any, GetMessagesProps, ThunkApiConfig>(
  GET_MESSAGES,
  async ({type, userId}, {rejectWithValue, extra: firebase, getState}) => {
    const PAGE_LIMIT = 2;
    const {messages} = getState().message;

    try {
      const ref = firebase()
        .firestore()
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .where('userId', '==', userId);

      switch (type) {
        case 'initial': {
          const snapshot = await ref.limit(PAGE_LIMIT).get();
          return {messages: snapshot.docs?.map((doc) => doc.data()) ?? [], userId};
        }
        case 'forward': {
          const lastMessage = messages?.[messages.length - 1];
          if (lastMessage) {
            const snapshot = await ref.limit(PAGE_LIMIT).startAfter(lastMessage?.createdAt).get();
            const messages = snapshot.docs?.map((doc) => doc.data()) ?? [];
            return {messages, userId, movePage: 1};
          }
          return {messages: []};
        }
        case 'backward': {
          const {messages} = getState().message;
          const firstMessage = messages?.[0];
          if (firstMessage) {
            const snapshot = await ref.endBefore(firstMessage?.createdAt).limitToLast(PAGE_LIMIT).get();
            const messages = snapshot.docs?.map((doc) => doc.data()) ?? [];
            return {messages, userId, movePage: -1};
          }
          return {message: []};
        }
      }
    } catch (err) {
      return rejectWithValue('errr');
    }
  },
);

const defaultState = {
  userId: '',
  messages: [],
  loading: false,
  currentPage: 0,
  error: '',
};

export const messageReducer = createReducer<MessageState>(defaultState, (builder) =>
  builder
    .addCase(createMessage.pending, (state) => {
      return {...state, loading: true, error: ''};
    })
    .addCase(createMessage.fulfilled, () => defaultState)
    .addCase(createMessage.rejected, (state, {payload}) => {
      return {...state, loading: true, error: payload ?? 'Error'};
    })
    .addCase(getMessages.pending, (state) => {
      return {...state, loading: true, error: ''};
    })
    .addCase(getMessages.fulfilled, (state, {payload: {userId, messages, movePage = 0}}) => {
      if (state.userId !== userId || state.userId === '') {
        return {...state, messages, userId, loading: false, error: '', currentPage: 0};
      } else {
        return messages.length == 0
          ? {...state, loading: false, error: ''}
          : {...state, messages, userId, currentPage: state.currentPage + movePage};
      }
    }),
);
