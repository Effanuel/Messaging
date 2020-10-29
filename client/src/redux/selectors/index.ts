import {createSelector} from '@reduxjs/toolkit';
import {AppState} from 'redux/models/state';

const getAuthUId = ({firebase: {auth}}: AppState) => auth.uid;

export const userLoggedInSelector = createSelector([getAuthUId], (uid): boolean => Boolean(uid));
