import React from 'react';
import {makeStyles, MenuItem} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {signOutUser} from 'redux/modules/auth/authModule';
import {AppState} from 'redux/models/state';

const useStyles = makeStyles((theme) => ({
  textShadow: {textShadow: '1px 1px black', padding: 0},
}));

function SignedInLinks() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const username = useSelector((state: AppState) => state.auth.username);
  const authenticated = useSelector((state: AppState) => state.auth.authenticated);

  const signOut = React.useCallback(() => {
    dispatch(signOutUser(''));
  }, [dispatch]);

  return (
    <>
      {authenticated && <div className={classes.textShadow}>{'Logged in as ' + username}</div>}
      <MenuItem onClick={signOut} component={NavLink} to="/signin" color="inherit" className={classes.textShadow}>
        Sign Out
      </MenuItem>
    </>
  );
}

export {SignedInLinks};
