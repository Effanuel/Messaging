import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {MessageCard} from 'components';
import {useDispatch} from 'react-redux';
import {likeMessage, unlikeMessage} from 'redux/modules/message/messageModule';
import {Message} from 'redux/modules/message/types';

interface Props {
  firestoreMessages: Message[];
  loggedInUserId: string;
}

function CardList({firestoreMessages, loggedInUserId}: Props) {
  const dispatch = useDispatch();

  const onLikePost = React.useCallback(
    (postId: string) => {
      if (loggedInUserId) {
        dispatch(likeMessage({postId}));
      }
    },
    [dispatch, loggedInUserId],
  );
  const onUnlikePost = React.useCallback(
    (postId: string) => {
      if (loggedInUserId) {
        dispatch(unlikeMessage({postId}));
      }
    },
    [dispatch, loggedInUserId],
  );

  return (
    <>
      {!_.isNil(firestoreMessages) &&
        firestoreMessages.map((message, index) => {
          const {username, text, createdAt, id, isLiked} = message;
          const date = moment(createdAt?.seconds * 1000).fromNow();
          return (
            <MessageCard
              key={index}
              id={id}
              username={username}
              isLiked={isLiked}
              createdAt={date}
              text={text}
              onLikePost={onLikePost}
              onUnlikePost={onUnlikePost}
            />
          );
        })}
    </>
  );
}

export {CardList};
