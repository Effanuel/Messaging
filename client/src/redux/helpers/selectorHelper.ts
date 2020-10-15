import {useSelector, shallowEqual} from 'react-redux';

import {AppState} from 'redux/models/state';
import {userLoggedInSelector} from 'redux/selectors';

// type States = UnionToIntersection<ValueOf<AppState>>;

interface Selectors {
  isLoggedIn: ReturnType<typeof userLoggedInSelector>;
  authUid: string;
  authDisplayName: string | null;
  firebaseInitializing: boolean;
  profile: any;
  loggedInUserId: string;

  firestoreMessages: any;

  authLoading: boolean;
  authError: string;
  authSignedUpSuccessfully: boolean;

  messageLoading: boolean;
  messageError: string;

  state: any;
}

const buildSelectors = (state: AppState): Selectors => {
  const {firebase, auth, message, firestore} = state;
  return {
    isLoggedIn: userLoggedInSelector(state),
    authUid: firebase.auth.uid,
    authDisplayName: firebase.auth.displayName,
    firebaseInitializing: firebase.isInitializing,
    profile: firebase.profile,
    loggedInUserId: firebase.auth.uid,

    firestoreMessages: firestore?.data?.messages,

    authLoading: auth.loading,
    authError: auth.error,
    authSignedUpSuccessfully: auth.signedUpSuccessfully,

    messageLoading: message.loading,
    messageError: message.error,

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
