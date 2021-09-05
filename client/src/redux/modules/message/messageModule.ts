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
  //   const tags = (payload.text.match(/#\w+/g) ?? []).map((tag) => tag.replace(/#/gm, ''));
  //   const message = {...payload, createdAt: new Date(), tags};
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
    // const firestore = firebase().firestore();
    // const likesRef = firestore.collection('likes');
    // const getLikedPostsIds = async (messageIds: string[]): Promise<string[]> => {
    //   const snapshot = await likesRef
    //     .where('postId', 'in', messageIds)
    //     .where('userId', '==', getState().firebase.auth.uid)
    //     .get();
    //   return snapshot.docs?.map((doc) => doc.data().postId ?? '');
    // };
    // const gatherMessages = async (messagesSnapshot: any) => {
    //   const messagesData = messagesSnapshot.docs?.map((doc: any) => ({...doc.data(), id: doc.id})) ?? [];
    //   const messageIds = messagesData.map((message: any) => message.id);
    //   const likes = !!getState().firebase.auth.uid ? await getLikedPostsIds(messageIds) : [];
    //   return messagesData.map((message: any) => ({...message, isLiked: likes.includes(message.id)}));
    // };
    // const gatherFollows = async (): Promise<string[]> => {
    //   const followerId = getState().firebase.auth.uid;
    //   const followsSnap = await firestore.collection('follows').where('followerId', '==', followerId).get();
    //   const followsData = followsSnap.docs?.map((doc) => doc.data()) ?? [];
    //   return followsData.map((follow) => follow.userId);
    // };
    // async function getMessagesOfFollowedUsers() {
    //   const followedUserIds = await gatherFollows();
    //   return firestore
    //     .collection('messages')
    //     .orderBy('createdAt', 'desc')
    //     .where('userId', 'in', [getState().firebase.auth.uid, ...followedUserIds.slice(0, 9)]);
    // }
    // function getMessagesByTag() {
    //   return firestore
    //     .collection('messages')
    //     .orderBy('createdAt', 'desc')
    //     .where('tags', 'array-contains-any', tagNames);
    // }
    try {
      //   const messagesRef =
      //     query === 'userMessages'
      //       ? getMessages()
      //       : query === 'messagesByTag'
      //       ? getMessagesByTag()
      //       : await getMessagesOfFollowedUsers();
      switch (type) {
        case 'initial': {
          if (query === 'userMessages') {
            const result = await axios.post('/message/userMessages', {userId});
            return {messages: result.data.messages};
          }
          const result = await axios.get('/message/followerMessages');
          return {messages: result.data.messages};
        }
        // case 'forward': {
        //   const {messages} = getState().message;
        //   const lastMessage = messages?.[messages.length - 1];
        //   if (lastMessage) {
        //     const snapshot = await messagesRef.limit(PAGE_LIMIT).startAfter(lastMessage?.createdAt).get();
        //     const messages = await gatherMessages(snapshot);
        //     return {messages, userId, movePage: 1};
        //   }
        //   return {messages: []};
        // }
        // case 'backward': {
        //   const {messages} = getState().message;
        //   const firstMessage = messages?.[0];
        //   if (firstMessage) {
        //     const snapshot = await messagesRef.endBefore(firstMessage?.createdAt).limitToLast(PAGE_LIMIT).get();
        //     const messages = await gatherMessages(snapshot);
        //     return {messages, userId, movePage: -1};
        //   }
        //   return {messages: []};
        // }
      }
      return undefined;
    } catch (error: any) {
      console.log('ERRROR3323', error.response.data.error);
      return rejectWithValue(error.response?.data.error);
      //   return {messages: []};
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
