import {createReducer} from '@reduxjs/toolkit';
import {createThunk} from 'redux/helpers/thunks';
import {CREATE_MESSAGE, MessageState} from './types';

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

const defaultState = {
  loading: false,
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
    }),
);
