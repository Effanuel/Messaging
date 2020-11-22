import React from 'react';
import _ from 'lodash';
import {useDispatch} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {createMessage} from 'redux/modules/message/messageModule';
import {CardList, Header, MessageCard} from 'components';
import {makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
}));

const Home = React.memo(() => {
  const classes = useStyles();
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
    setMessage('');
  }, [dispatch, message, profile, loggedInUserId]);

  const handleTextChange = React.useCallback(({target: {value}}: any) => {
    setMessage(value);
  }, []);

  return (
    <>
      <Header label="HOME" />
      <div className={classes.root}>
        {isLoggedIn && (
          <MessageCard
            onTextChange={handleTextChange}
            onActionClick={postMessage}
            username={profile.username}
            createdAt={''}
            type="input"
            value={message}
          />
        )}
        <CardList firestoreMessages={firestoreMessages} />
        {firestoreMessages === null && loggedInUserId !== undefined && (
          <div style={{color: 'white'}}>You haven`t posted any messages</div>
        )}
        {(firestoreMessages === null || firestoreMessages?.length == 0) && loggedInUserId === undefined && (
          <div style={{color: 'white', marginTop: 20}}>Log in to post messages</div>
        )}
      </div>
    </>
  );
});

export default Home;
