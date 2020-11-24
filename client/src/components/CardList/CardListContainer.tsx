import _ from 'lodash';
import React from 'react';
import {CardList} from 'components';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {useDispatch} from 'react-redux';
import {getProfile} from 'redux/modules/message/messageModule';
import {Button, ButtonGroup} from '@material-ui/core';
import {AsyncThunkAction} from '@reduxjs/toolkit';
import {ThunkApiConfig} from 'redux/helpers/thunks';

function CardListContainer<T>({
  userId,
  emptyCta,
  loadMessagesAction,
}: {
  userId: string;
  emptyCta: string;
  loadMessagesAction: (args: {type: any; userId: string}) => AsyncThunkAction<any, T, ThunkApiConfig>;
}) {
  const dispatch = useDispatch();
  const {messages, isNextPageDisabled, currentPage, loggedInUserId} = useReduxSelector(
    'messages',
    'isNextPageDisabled',
    'currentPage',
    'loggedInUserId',
  );

  React.useEffect(() => {
    dispatch(loadMessagesAction({type: 'initial', userId: userId ?? ''}));
    dispatch(getProfile({userId}));
  }, [dispatch, userId, loadMessagesAction]);

  const nextPage = React.useCallback(() => {
    dispatch(loadMessagesAction({type: 'forward', userId: userId ?? ''}));
  }, [dispatch, userId, loadMessagesAction]);

  const prevPage = React.useCallback(() => {
    dispatch(loadMessagesAction({type: 'backward', userId: userId ?? ''}));
  }, [dispatch, userId, loadMessagesAction]);

  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      {messages?.length && userId !== '' ? (
        <CardList firestoreMessages={messages} loggedInUserId={loggedInUserId} />
      ) : (
        <div style={{color: 'white', paddingTop: 20, paddingBottom: 20}}>{emptyCta} </div>
      )}
      {messages?.length && userId !== '' ? (
        <ButtonGroup variant="contained" color="primary">
          <Button disabled={currentPage === 0} onClick={prevPage}>
            Previous
          </Button>
          <Button disabled={isNextPageDisabled} onClick={nextPage}>
            Next
          </Button>
        </ButtonGroup>
      ) : null}
    </div>
  );
}

export {CardListContainer};
