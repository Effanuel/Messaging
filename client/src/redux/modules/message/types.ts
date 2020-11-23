export const CREATE_MESSAGE = 'message/CREATE_MESSAGE';

export const GET_MESSAGES = 'message/GET_MESSAGES';
export const LIKE_MESSAGE = 'message/LIKE_MESSAGE';
export const UNLIKE_MESSAGE = 'message/UNLIKE_MESSAGE';

export interface Message {
  id: string;
  username: string;
  userId: string;
  text: string;
  createdAt: {seconds: number; nanoseconds: number};
  isLiked: boolean;
}

export interface MessageState {
  userId: string;
  messages: Message[];
  loading: boolean;
  currentPage: number;
  error: string;
}
