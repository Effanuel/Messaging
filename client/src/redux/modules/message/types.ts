export const GET_MESSAGES = 'message/GET_MESSAGES';
export const GET_PROFILE = 'message/GET_PROFILE';

export const CREATE_MESSAGE = 'message/CREATE_MESSAGE';
export const LIKE_MESSAGE = 'message/LIKE_MESSAGE';
export const UNLIKE_MESSAGE = 'message/UNLIKE_MESSAGE';
export const FOLLOW_USER = 'message/FOLLOW_USER';
export const UNFOLLOW_USER = 'message/UNFOLLOW_USER';

export const CLEAR_MESSAGES = 'message/CLEAR_MESSAGES';

export interface Message {
  _id: string;
  username: string;
  userId: string;
  text: string;
  createdAt: string;
  isLiked: boolean;
  likes?: number;
}

export interface Profile {
  userId: string;
  isFollowing: boolean;
  name: string;
  followerCount: number;
  isVerified: boolean;
}

export interface MessageState {
  userId: string;
  messages: Message[];
  profile: Profile;
  loading: boolean;
  currentPage: number;
  error: string;
}
