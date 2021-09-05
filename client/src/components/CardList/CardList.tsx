import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {MessageCard} from 'components';
import {useDispatch} from 'react-redux';
import {likeMessage, unlikeMessage} from 'redux/modules/message/messageModule';
import {Message} from 'redux/modules/message/types';

interface Props {
  firestoreMessages: Message[];
}

function CardList({firestoreMessages}: Props) {
  const dispatch = useDispatch();

  const onLikePost = React.useCallback(
    (messageId: string, userId: string) => dispatch(likeMessage({messageId})),
    [dispatch],
  );
  const onUnlikePost = React.useCallback(
    (messageId: string, userId: string) => dispatch(unlikeMessage({messageId})),
    [dispatch],
  );

  return (
    <>
      {!_.isNil(firestoreMessages) &&
        firestoreMessages.map((message, index) => {
          const {createdAt, ...rest} = message;
          const date = moment(createdAt).fromNow();
          return (
            <MessageCard key={index} {...rest} createdAt={date} onLikePost={onLikePost} onUnlikePost={onUnlikePost} />
          );
        })}
    </>
  );
}

export {CardList};
