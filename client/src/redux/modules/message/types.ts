export const CREATE_MESSAGE = 'message/CREATE_MESSAGE';

export const GET_MESSAGES = 'message/GET_MESSAGES';

export interface Message {
  username: string;
  userId: string;
  text: string;
  createdAt: {seconds: number; nanoseconds: number};
}

export interface MessageState {
  userId: string;
  messages: Message[];
  loading: boolean;
  currentPage: number;
  error: string;
}
