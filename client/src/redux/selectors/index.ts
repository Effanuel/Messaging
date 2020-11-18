import {createSelector} from '@reduxjs/toolkit';
import {AppState} from 'redux/models/state';

const getAuthUId = ({firebase: {auth}}: AppState) => auth.uid;
const getMessages = ({message}: AppState) => message.messages;

export const userLoggedInSelector = createSelector([getAuthUId], (uid): boolean => Boolean(uid));

export const isNextPageDisabledSelector = createSelector([getMessages], (messages) => messages.length < 2);
