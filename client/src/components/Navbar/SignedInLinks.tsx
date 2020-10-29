import React from 'react';
import {MenuItem} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {signOutUser} from 'redux/modules/auth/authModule';

function SignedInLinks() {
  const dispatch = useDispatch();

  const {profile} = useReduxSelector('profile');

  const signOut = React.useCallback(() => {
    dispatch(signOutUser(''));
  }, [dispatch]);

  return (
    <>
      {profile.username && 'Logged in as ' + profile.username}

      <MenuItem onClick={signOut} component={NavLink} to="/signin" color="inherit">
        Sign Out
      </MenuItem>
    </>
  );
}

export {SignedInLinks};
