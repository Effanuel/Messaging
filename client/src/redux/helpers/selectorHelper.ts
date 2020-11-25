import {useSelector, shallowEqual} from 'react-redux';
import {AppState} from 'redux/models/state';
import {Message, Profile} from 'redux/modules/message/types';
import {isNextPageDisabledSelector, userLoggedInSelector} from 'redux/selectors';

interface FirestoreUsers {
  [userId: string]: {
    email: string;
    username: string;
  };
}

interface Selectors {
  isLoggedIn: ReturnType<typeof userLoggedInSelector>;
  isNextPageDisabled: ReturnType<typeof isNextPageDisabledSelector>;
  authUid: string;
  authDisplayName: string | null;
  firebaseInitializing: boolean;
  profile: any;
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
  follProfile: Profile;

  state: any;
}

const buildSelectors = (state: AppState): Selectors => {
  const {firebase, auth, message, firestore} = state;
  return {
    isLoggedIn: userLoggedInSelector(state),
    isNextPageDisabled: isNextPageDisabledSelector(state),
    authUid: firebase.auth.uid,
    authDisplayName: firebase.auth.displayName,
    firebaseInitializing: firebase.isInitializing,
    profile: firebase.profile,
    loggedInUserId: firebase.auth.uid,

    firestoreMessages: firestore?.ordered?.messages,
    firestoreUsers: firestore?.data.users,
    firestoreLoading: Boolean(Object.values(firestore?.status?.requesting)?.[0]),

    authLoading: auth.loading,
    authError: auth.error,
    authSignedUpSuccessfully: auth.signedUpSuccessfully,

    messageLoading: message.loading,
    messageError: message.error,
    messages: message.messages.slice(0, 5),
    currentPage: message.currentPage,
    follProfile: message.profile,

    state: firebase,
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
