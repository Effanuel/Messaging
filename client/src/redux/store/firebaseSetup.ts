import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore'; // <- needed if using firestore
import {dispatch} from './store';
import {createFirestoreInstance} from 'redux-firestore';
import {ReactReduxFirebaseProviderProps} from 'react-redux-firebase';
// import 'firebase/functions' // <- needed if using httpsCallable

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  appId: process.env.REACT_APP_APP_ID,
  authDomain: 'messages-19b7a.firebaseapp.com',
  databaseURL: 'https://messages-19b7a.firebaseio.com',
  projectId: 'messages-19b7a',
  storageBucket: 'messages-19b7a.appspot.com',
  messagingSenderId: '613979954932',
  measurementId: 'G-JCN2GKW5E8',
};

const config = {
  attachAuthIsReady: true,
  userProfile: 'users',
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
  // enableClaims: true // Get custom claims along with the profile
};

firebase.initializeApp(firebaseConfig);
firebase.firestore(); // <- needed if using firestore
// firebase.functions() // <- needed if using httpsCallable

export const reactReduxFirebaseProps: ReactReduxFirebaseProviderProps = {
  firebase,
  config,
  dispatch,
  createFirestoreInstance,
};

export const atomicIncrement = firebase.firestore.FieldValue.increment(1);
export const atomicDecrement = firebase.firestore.FieldValue.increment(-1);
