import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

export const createUser = functions.auth.user().onCreate((user) => {
  console.log('CREATE USER');
  const userData = {uid: user.uid, email: user.email, isVerified: false};
  admin.firestore().collection('users').add(userData);
});
