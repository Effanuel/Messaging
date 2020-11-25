import React from 'react';
import {useDispatch} from 'react-redux';
import {Button, ButtonGroup} from '@material-ui/core';
import _ from 'lodash';
import {CardList} from 'components';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {getMessages, getProfile} from 'redux/modules/message/messageModule';

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
      dispatch(getMessages({type: 'initial', userId, query}));
      dispatch(getProfile({userId}));
    }
  }, [dispatch, userId, query]);

  const nextPage = React.useCallback(() => {
    if (userId) {
      dispatch(getMessages({type: 'forward', userId, query}));
    }
  }, [dispatch, userId, query]);

  const prevPage = React.useCallback(() => {
    if (userId) {
      dispatch(getMessages({type: 'backward', userId, query}));
    }
  }, [dispatch, userId, query]);

  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      {messages?.length && userId !== undefined ? (
        <CardList firestoreMessages={messages} loggedInUserId={loggedInUserId} />
      ) : (
        <div style={{color: 'white', paddingTop: 20, paddingBottom: 20}}>{emptyCta}</div>
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
