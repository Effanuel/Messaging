import React from 'react';
import {MenuItem} from '@material-ui/core';
import {NavLink} from 'react-router-dom';

function SignedOutLinks() {
  return (
    <>
      <MenuItem component={NavLink} to="/signin" color="inherit">
        Sign In
      </MenuItem>
      <MenuItem component={NavLink} to="/signup" color="inherit">
        Sign Up
      </MenuItem>
    </>
  );
}

export {SignedOutLinks};
