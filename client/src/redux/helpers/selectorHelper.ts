import {useSelector, shallowEqual} from 'react-redux';
import {AppState} from 'redux/models/state';
import {Message, Profile} from 'redux/modules/message/types';
import {isNextPageDisabledSelector} from 'redux/selectors';

export interface User {
  id: string;
  _id: string;
  email: string;
  username: string;
  followerCount: number;
  isVerified: boolean;
}

type FirestoreUsers = {[userId: string]: User};

interface Selectors {
  authenticated: boolean;
  isNextPageDisabled: ReturnType<typeof isNextPageDisabledSelector>;
  authUid: string;
  authDisplayName: string | null;
  loggedInUserId: string | undefined;

  firestoreMessages: Message[];
  firestoreUsers: FirestoreUsers | undefined;
  firestoreLoading: boolean;

  authLoading: boolean;
  authError: string;
  authSignedUpSuccessfully: boolean;

  messageLoading: boolean;
  messageError: string;
  messages: AppState['message']['messages'];
  currentPage: number;
  userProfile: Profile;

  users: User[];
}

const buildSelectors = (state: AppState): Selectors => {
  const {auth, message, user} = state;
  return {
    authenticated: auth.authenticated,
    isNextPageDisabled: isNextPageDisabledSelector(state),
    authUid: '',
    authDisplayName: '',
    loggedInUserId: '', // firebase.auth.uid,

    firestoreMessages: [],
    firestoreUsers: [] as any,
    firestoreLoading: false,

    authLoading: auth.loading,
    authError: auth.error,
    authSignedUpSuccessfully: auth.signedUpSuccessfully,

    messageLoading: message.loading,
    messageError: message.error,
    messages: message.messages.slice(0, 5),
    currentPage: message.currentPage,
    userProfile: message.profile,

    users: user.users,
  };
};

export function useReduxSelector<K extends keyof Selectors>(...keys: K[]): Pick<Selectors, K> {
  const selector = useSelector((state: AppState) => {
    const builtSelectors = buildSelectors(state);
    return keys.reduce(
      (availableSelectors: any, selectorKey: keyof Selectors) => (
        (availableSelectors[selectorKey] = builtSelectors[selectorKey]), availableSelectors
      ),
      {},
    );
  }, shallowEqual);
  return selector;
}
