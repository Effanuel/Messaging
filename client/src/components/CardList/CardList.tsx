import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {MessageCard} from 'components';

interface Props {
  firestoreMessages: any;
}

function CardList({firestoreMessages}: Props) {
  return (
    <>
      {!_.isNil(firestoreMessages) &&
        firestoreMessages.map((message: any, index: number) => {
          const {username, text, createdAt} = message;
          const date = moment(createdAt?.seconds * 1000).fromNow();
          return <MessageCard key={index} username={username} createdAt={date} type="card" text={text} />;
        })}
    </>
  );
}

export {CardList};
