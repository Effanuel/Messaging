export const SIGN_OUT = 'auth/SIGN_OUT';
export const SIGN_IN = 'auth/SIGN_IN';
export const SIGN_UP = 'auth/SIGN_UP';

export const CLEAR_AUTH_STATE = 'auth/CLEAR_AUTH_STATE';

export interface AuthState {
  error: string;
  loading: boolean;
  signedUpSuccessfully: boolean;
  authenticated: boolean;
  username: string;
  id: string;
}
