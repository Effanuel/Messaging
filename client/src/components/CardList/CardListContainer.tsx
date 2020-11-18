import _ from 'lodash';
import React from 'react';
import {CardList} from 'components';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {useDispatch} from 'react-redux';
import {getMessages} from 'redux/modules/message/messageModule';
import {Button, ButtonGroup} from '@material-ui/core';

function CardListContainer({userId}: {userId: string}) {
  const dispatch = useDispatch();
  const {messages, isNextPageDisabled, currentPage} = useReduxSelector('messages', 'isNextPageDisabled', 'currentPage');

  React.useEffect(() => {
    dispatch(getMessages({type: 'initial', userId: userId ?? ''}));
  }, [dispatch, userId]);

  const nextPage = React.useCallback(() => {
    dispatch(getMessages({type: 'forward', userId: userId ?? ''}));
  }, [dispatch, userId]);

  const prevPage = React.useCallback(() => {
    dispatch(getMessages({type: 'backward', userId: userId ?? ''}));
  }, [dispatch, userId]);

  return (
    <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
      {messages?.length ? (
        <CardList firestoreMessages={messages} />
      ) : (
        <div style={{color: 'white'}}>This user doesn`t have any messages posted.</div>
      )}

      <ButtonGroup variant="contained" color="primary">
        <Button disabled={currentPage === 0} onClick={prevPage}>
          Previous
        </Button>
        <Button disabled={isNextPageDisabled} onClick={nextPage}>
          Next
        </Button>
      </ButtonGroup>
    </div>
  );
}

export {CardListContainer};
