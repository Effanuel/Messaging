import {createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {createThunk, ThunkApiConfig} from 'redux/helpers/thunks';
import {CREATE_MESSAGE, GET_MESSAGES, LIKE_MESSAGE, MessageState, UNLIKE_MESSAGE} from './types';

export const PAGE_LIMIT = 6;

interface LikeMessageProps {
  postId: string;
  userId: string;
}

export const likeMessage = createThunk<LikeMessageProps>(LIKE_MESSAGE, async (payload, firebase) => {
  const {postId, userId} = payload;
  const like = {userId, postId};
  await firebase().firestore().collection('likes').add(like);
  return postId;
});

interface UnlikeMessageProps {
  postId: string;
  userId: string;
}

export const unlikeMessage = createThunk<UnlikeMessageProps>(UNLIKE_MESSAGE, async (payload, firebase) => {
  const {postId, userId} = payload;
  const snapshot = await firebase()
    .firestore()
    .collection('likes')
    .where('postId', '==', postId)
    .where('userId', '==', userId)
    .get();

  snapshot.docs[0].ref.delete();
  return postId;
});

interface CreateMessageProps {
  text: string;
  username: string;
  userId: string;
}

export const createMessage = createThunk<CreateMessageProps>(CREATE_MESSAGE, async (payload, firebase) => {
  const message = {...payload, createdAt: new Date()};
  const {id} = await firebase().firestore().collection('messages').add(message);
  return {...message, id, isLiked: false};
});

interface GetMessagesProps {
  type: 'initial' | 'forward' | 'backward';
  userId: string;
}

export const getMessages = createAsyncThunk<any, GetMessagesProps, ThunkApiConfig>(
  GET_MESSAGES,
  async ({type, userId}, {rejectWithValue, extra: firebase, getState}) => {
    const likesRef = firebase().firestore().collection('likes');

    const getLikedPosts = async (messageIds: string[]): Promise<string[]> => {
      const snapshot = await likesRef.where('postId', 'in', messageIds).get();
      return snapshot.docs?.map((doc) => doc.data().postId ?? []);
    };

    const gatherMessages = async (messagesSnapshot: any) => {
      const messagesData = messagesSnapshot.docs?.map((doc: any) => ({...doc.data(), id: doc.id})) ?? [];
      const messageIds = messagesData.map((message: any) => message.id);

      const likes = await getLikedPosts(messageIds);
      return messagesData.map((message: any) => ({...message, isLiked: likes.includes(message.id)}));
    };

    try {
      const messagesRef = firebase()
        .firestore()
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .where('userId', '==', userId);

      switch (type) {
        case 'initial': {
          const snapshot = await messagesRef.limit(PAGE_LIMIT).get();
          const messages = await gatherMessages(snapshot);
          return {messages, userId};
        }
        case 'forward': {
          const {messages} = getState().message;
          const lastMessage = messages?.[messages.length - 1];
          if (lastMessage) {
            const snapshot = await messagesRef.limit(PAGE_LIMIT).startAfter(lastMessage?.createdAt).get();
            const messages = await gatherMessages(snapshot);
            return {messages, userId, movePage: 1};
          }
          return {messages: []};
        }
        case 'backward': {
          const {messages} = getState().message;
          const firstMessage = messages?.[0];
          if (firstMessage) {
            const snapshot = await messagesRef.endBefore(firstMessage?.createdAt).limitToLast(PAGE_LIMIT).get();
            const messages = await gatherMessages(snapshot);
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
    .addCase(createMessage.fulfilled, (state, {payload}) => {
      return {...state, messages: [payload, ...state.messages]};
    })
    .addCase(createMessage.rejected, (state, {payload}) => {
      return {...state, loading: true, error: payload ?? 'Error'};
    })
    .addCase(getMessages.pending, (state) => {
      return {...state, loading: true, error: ''};
    })
    .addCase(getMessages.fulfilled, (state, {payload: {userId, messages, movePage = 0, likes}}) => {
      if (state.userId !== userId || state.userId === '') {
        return {...state, messages, likes, userId, loading: false, error: '', currentPage: 0};
      } else {
        return messages.length == 0
          ? {...state, loading: false, error: ''}
          : {...state, messages, likes, userId, currentPage: state.currentPage + movePage};
      }
    })
    .addCase(likeMessage.fulfilled, (state, {payload}) => {
      const messageIndex = state.messages.findIndex((message) => message.id === payload);
      const updatedMessage = {...state.messages[messageIndex], isLiked: true};
      const updatedMessages = [
        ...state.messages.slice(0, messageIndex),
        updatedMessage,
        ...state.messages.slice(messageIndex + 1),
      ];

      return {...state, loading: true, error: '', messages: updatedMessages};
    })
    .addCase(unlikeMessage.fulfilled, (state, {payload}) => {
      const messageIndex = state.messages.findIndex((message) => message.id === payload);
      const updatedMessage = {...state.messages[messageIndex], isLiked: false};
      const updatedMessages = [
        ...state.messages.slice(0, messageIndex),
        updatedMessage,
        ...state.messages.slice(messageIndex + 1),
      ];

      return {...state, loading: true, error: '', messages: updatedMessages};
    }),
);
