import _ from 'lodash';
import React from 'react';
import {CardList} from 'components';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {useDispatch} from 'react-redux';
import {getMessages, getProfile} from 'redux/modules/message/messageModule';
import {Button, ButtonGroup} from '@material-ui/core';

interface Props {
  userId: string | undefined;
  emptyCta: string;
  query: 'userMessages' | 'followedUsersMessages';
}

function CardListContainer({userId, emptyCta, query}: Props) {
  const dispatch = useDispatch();
  const {messages, isNextPageDisabled, currentPage, loggedInUserId} = useReduxSelector(
    'messages',
    'isNextPageDisabled',
    'currentPage',
    'loggedInUserId',
  );

  React.useEffect(() => {
    if (userId) {
      dispatch(getMessages({type: 'initial', userId: userId ?? '', query}));
      if (loggedInUserId) {
        dispatch(getProfile({userId}));
      }
    }
  }, [dispatch, userId, query, loggedInUserId]);

  const nextPage = React.useCallback(() => {
    dispatch(getMessages({type: 'forward', userId: userId ?? '', query}));
  }, [dispatch, userId, query]);

  const prevPage = React.useCallback(() => {
    dispatch(getMessages({type: 'backward', userId: userId ?? '', query}));
  }, [dispatch, userId, query]);

  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      {messages?.length && userId !== undefined ? (
        <CardList firestoreMessages={messages} loggedInUserId={loggedInUserId} />
      ) : (
        <div style={{color: 'white', paddingTop: 20, paddingBottom: 20}}>{emptyCta} </div>
      )}
      {messages?.length && userId !== undefined ? (
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
