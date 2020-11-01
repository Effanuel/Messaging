import React from 'react';
import moment from 'moment';
import MessageCard from 'components/MessageCard/MessageCard';
import _ from 'lodash';

interface Props {
  firestoreMessages: any;
}

function CardList({firestoreMessages}: Props) {
  console.log('LISTST', firestoreMessages);
  return (
    <>
      {!_.isNil(firestoreMessages) &&
        firestoreMessages.map((message: any, index: number) => {
          const {username, text, createdAt} = message;
          console.log(message, '0990');
          const date = moment(createdAt?.seconds * 1000).fromNow();
          return <MessageCard key={index} username={username} createdAt={date} type="card" text={text} />;
        })}
    </>
  );
}

export {CardList};
