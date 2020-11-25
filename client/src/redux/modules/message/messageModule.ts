import {createAction, createAsyncThunk, createReducer} from '@reduxjs/toolkit';
import {createThunk, errorHandler, ThunkApiConfig} from 'redux/helpers/thunks';
import {atomicDecrement, atomicIncrement} from 'redux/store/firebaseSetup';
import {
  CLEAR_MESSAGES,
  CREATE_MESSAGE,
  FOLLOW_USER,
  GET_MESSAGES,
  GET_PROFILE,
  LIKE_MESSAGE,
  MessageState,
  UNFOLLOW_USER,
  UNLIKE_MESSAGE,
} from './types';

export const PAGE_LIMIT = 6;

export const clearMessages = createAction(CLEAR_MESSAGES);

export const likeMessage = createThunk<{postId: string}>(LIKE_MESSAGE, async ({postId}, firebase, getState) => {
  await firebase().firestore().collection('likes').add({userId: getState().firebase.auth.uid, postId});
  await firebase().firestore().collection('messages').doc(postId).update({likes: atomicIncrement});
  return postId;
});

export const unlikeMessage = createThunk<{postId: string}>(UNLIKE_MESSAGE, async ({postId}, firebase, getState) => {
  const snapshot = await firebase()
    .firestore()
    .collection('likes')
    .where('postId', '==', postId)
    .where('userId', '==', getState().firebase.auth.uid)
    .get();
  await firebase().firestore().collection('messages').doc(postId).update({likes: atomicDecrement});

  snapshot.docs[0].ref.delete();
  return postId;
});

type CreateMessageProps = {text: string; username: string; userId: string};
export const createMessage = createThunk<CreateMessageProps>(CREATE_MESSAGE, async (payload, firebase) => {
  const message = {...payload, createdAt: new Date()};
  const {id} = await firebase().firestore().collection('messages').add(message);
  return {...message, id, likes: 0};
});

export const followUser = createThunk<{userId: string}>(FOLLOW_USER, async ({userId}, firebase, getState) => {
  const firestore = firebase().firestore();
  await firestore.collection('follows').add({userId, followerId: getState().firebase.auth.uid});
  await firestore.collection('users').doc(userId).update({followerCount: atomicIncrement});
});

export const unfollowUser = createThunk<{userId: string}>(UNFOLLOW_USER, async ({userId}, firebase, getState) => {
  const firestore = firebase().firestore();
  const snapshot = await firestore
    .collection('follows')
    .where('userId', '==', userId)
    .where('followerId', '==', getState().firebase.auth.uid)
    .get();
  snapshot.docs[0].ref.delete();
  await firestore.collection('users').doc(userId).update({followerCount: atomicDecrement});
});

export const getProfile = createThunk<{userId: string}>(GET_PROFILE, async ({userId}, firebase, getState) => {
  const firestore = firebase().firestore();
  const {uid} = getState().firebase.auth;

  const followsSnapshot = uid
    ? await firestore.collection('follows').where('userId', '==', userId).where('followerId', '==', uid).get()
    : {empty: true};
  const userProfile = (await firestore.collection('users').doc(userId).get()).data();

  return {...userProfile, isFollowing: !followsSnapshot.empty};
});

type GetMessagesProps = {
  type: 'initial' | 'forward' | 'backward';
  userId: string;
  query: 'userMessages' | 'followedUsersMessages';
};
export const getMessages = createAsyncThunk<any, GetMessagesProps, ThunkApiConfig>(
  GET_MESSAGES,
  async ({type, userId, query}, {rejectWithValue, extra: firebase, getState}) => {
    const firestore = firebase().firestore();
    const likesRef = firestore.collection('likes');

    const getLikedPostsIds = async (messageIds: string[]): Promise<string[]> => {
      const snapshot = await likesRef
        .where('postId', 'in', messageIds)
        .where('userId', '==', getState().firebase.auth.uid)
        .get();
      return snapshot.docs?.map((doc) => doc.data().postId ?? '');
    };

    const gatherMessages = async (messagesSnapshot: any) => {
      const messagesData = messagesSnapshot.docs?.map((doc: any) => ({...doc.data(), id: doc.id})) ?? [];
      const messageIds = messagesData.map((message: any) => message.id);

      const likes = !!getState().firebase.auth.uid ? await getLikedPostsIds(messageIds) : [];
      return messagesData.map((message: any) => ({...message, isLiked: likes.includes(message.id)}));
    };

    const gatherFollows = async (): Promise<string[]> => {
      const followerId = getState().firebase.auth.uid;
      const followsSnap = await firestore.collection('follows').where('followerId', '==', followerId).get();
      const followsData = followsSnap.docs?.map((doc) => doc.data()) ?? [];
      return followsData.map((follow) => follow.userId);
    };

    function getMessages() {
      return firestore.collection('messages').orderBy('createdAt', 'desc').where('userId', '==', userId);
    }

    async function getMessagesOfFollowedUsers() {
      const followedUserIds = await gatherFollows();
      return firestore
        .collection('messages')
        .orderBy('createdAt', 'desc')
        .where('userId', 'in', [getState().firebase.auth.uid, ...followedUserIds.slice(0, 9)]);
    }

    try {
      const messagesRef = query === 'userMessages' ? getMessages() : await getMessagesOfFollowedUsers();

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
          return {messages: []};
        }
      }
    } catch (err) {
      const errorMessage: string = errorHandler?.[err?.code] ?? 'error';
      return rejectWithValue(errorMessage);
    }
  },
);

const defaultState = {
  userId: '',
  messages: [],
  profile: {userId: '', isFollowing: false, name: '', followerCount: 0},
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

      return {...state, loading: true, error: '', messages: updatedMessages};
    })
    .addCase(unlikeMessage.fulfilled, (state, {payload}) => {
      const messageIndex = state.messages.findIndex((message) => message.id === payload);
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
