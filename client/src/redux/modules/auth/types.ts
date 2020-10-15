export const SIGN_OUT = 'auth/SIGN_OUT';
export const SIGN_IN = 'auth/SIGN_IN';
export const SIGN_UP = 'auth/SIGN_UP';

export interface AuthState {
  error: string;
  loading: boolean;
  signedUpSuccessfully: boolean;
}
