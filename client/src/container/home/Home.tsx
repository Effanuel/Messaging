import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import {useDispatch} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import MessageCard from 'components/MessageCard/MessageCard';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {createMessage} from 'redux/modules/message/messageModule';

const Home = React.memo(() => {
  const dispatch = useDispatch();

  const [message, setMessage] = React.useState('');

  const {firestoreMessages, profile, loggedInUserId, isLoggedIn} = useReduxSelector(
    'firestoreMessages',
    'profile',
    'loggedInUserId',
    'isLoggedIn',
  );

  useFirestoreConnect({
    collection: 'messages',
    where: ['userId', '==', loggedInUserId ?? ''],
    orderBy: ['createdAt', 'desc'],
  });

  const postMessage = React.useCallback(() => {
    dispatch(createMessage({text: message, username: profile.username, userId: loggedInUserId}));
  }, [dispatch, message, profile, loggedInUserId]);

  const renderCard = React.useCallback(
    (messageId) => {
      const {username, text, createdAt} = firestoreMessages[messageId];
      const date = moment(createdAt?.seconds * 1000).fromNow();
      return <MessageCard key={messageId} username={username} createdAt={date} type="card" text={text} />;
    },
    [firestoreMessages],
  );

  const handleTextChange = React.useCallback(({target: {value}}: any) => {
    setMessage(value);
  }, []);

  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
      {isLoggedIn && (
        <MessageCard
          onTextChange={handleTextChange}
          onActionClick={postMessage}
          username={profile.username}
          createdAt={''}
          type="input"
        />
      )}
      {!_.isNil(firestoreMessages) && Object.keys(firestoreMessages).map(renderCard)}
      {firestoreMessages === null && loggedInUserId !== undefined && (
        <div style={{color: 'white'}}>You haven't posted any messages</div>
      )}
      {firestoreMessages === null && loggedInUserId === undefined && (
        <div style={{color: 'white'}}>Log in to post messages</div>
      )}
    </div>
  );
});

export default Home;
