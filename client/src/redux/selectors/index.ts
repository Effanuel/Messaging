import {createSelector} from '@reduxjs/toolkit';
import {AppState} from 'redux/models/state';
import {PAGE_LIMIT} from 'redux/modules/message/messageModule';

const getMessages = ({message}: AppState) => message.messages;

export const isNextPageDisabledSelector = createSelector([getMessages], (messages) => messages.length < PAGE_LIMIT);
