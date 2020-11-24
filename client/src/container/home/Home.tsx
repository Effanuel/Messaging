import React from 'react';
import _ from 'lodash';
import {useDispatch} from 'react-redux';
import {useFirestoreConnect} from 'react-redux-firebase';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {createMessage, getFollowedUsersMessages} from 'redux/modules/message/messageModule';
import {CardListContainer, Header, InputCard} from 'components';
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

  const {profile, loggedInUserId, isLoggedIn} = useReduxSelector('profile', 'loggedInUserId', 'isLoggedIn');

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

  const label = loggedInUserId === undefined ? 'Log in to post messages' : 'You haven`t posted any messages';

  return (
    <>
      <Header name="HOME" />
      <div className={classes.root}>
        {isLoggedIn && (
          <InputCard
            onTextChange={handleTextChange}
            onActionClick={postMessage}
            username={profile.username}
            value={message}
          />
        )}
        <CardListContainer
          loadMessagesAction={getFollowedUsersMessages}
          userId={loggedInUserId ?? ''}
          emptyCta={label}
        />
      </div>
    </>
  );
});

export default Home;
