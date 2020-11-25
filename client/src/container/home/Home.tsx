import React from 'react';
import _ from 'lodash';
import {useDispatch} from 'react-redux';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {clearMessages, createMessage} from 'redux/modules/message/messageModule';
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

  React.useEffect(() => {
    if (!isLoggedIn) {
      dispatch(clearMessages());
    }
  }, [dispatch, isLoggedIn]);

  const postMessage = React.useCallback(() => {
    if (loggedInUserId) {
      dispatch(createMessage({text: message, username: profile.username, userId: loggedInUserId}));
    }
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
        <CardListContainer query="followedUsersMessages" userId={loggedInUserId ?? ''} emptyCta={label} />
      </div>
    </>
  );
});

export default Home;
