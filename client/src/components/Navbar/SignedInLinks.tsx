import React from 'react';
import {makeStyles, MenuItem} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {signOutUser} from 'redux/modules/auth/authModule';

const useStyles = makeStyles((theme) => ({
  textShadow: {textShadow: '1px 1px black', padding: 0},
}));

function SignedInLinks() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const {profile} = useReduxSelector('profile');

  const signOut = React.useCallback(() => {
    dispatch(signOutUser(''));
  }, [dispatch]);

  return (
    <>
      {profile.username && <div className={classes.textShadow}>{'Logged in as ' + profile.username}</div>}

      <MenuItem onClick={signOut} component={NavLink} to="/signin" color="inherit" className={classes.textShadow}>
        Sign Out
      </MenuItem>
    </>
  );
}

export {SignedInLinks};
