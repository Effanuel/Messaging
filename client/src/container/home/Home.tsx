import React from 'react';
import _ from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {clearMessages, createMessage} from 'redux/modules/message/messageModule';
import {CardListContainer, Header, InputCard} from 'components';
import {makeStyles} from '@material-ui/core';
import {AppState} from 'redux/models/state';

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

  const username = useSelector((state: AppState) => state.auth.username);
  const authenticated = useSelector((state: AppState) => state.auth.authenticated);
  const userId = useSelector((state: AppState) => state.auth.id);

  React.useEffect(() => {
    if (!authenticated) {
      dispatch(clearMessages());
    }
  }, [dispatch, authenticated]);

  const postMessage = React.useCallback(() => {
    dispatch(createMessage({text: message}));
    setMessage('');
  }, [dispatch, message]);

  const handleTextChange = React.useCallback(({target: {value}}: any) => setMessage(value), []);

  const label = authenticated ? 'Log in to post messages' : 'You haven`t posted any messages';
  return (
    <>
      <Header name="HOME" />
      <div className={classes.root}>
        {authenticated && (
          <InputCard onTextChange={handleTextChange} onActionClick={postMessage} username={username} value={message} />
        )}
        <CardListContainer query="followedUsersMessages" emptyCta={label} userId={userId} />
      </div>
    </>
  );
});

export default Home;
