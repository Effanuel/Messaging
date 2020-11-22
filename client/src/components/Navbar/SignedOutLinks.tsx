import React from 'react';
import {makeStyles, MenuItem} from '@material-ui/core';
import {NavLink} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  textShadow: {textShadow: '1px 1px black', padding: 0},
}));

function SignedOutLinks() {
  const classes = useStyles();
  return (
    <>
      <MenuItem className={classes.textShadow} component={NavLink} to="/signin" color="inherit">
        Sign In
      </MenuItem>
      <MenuItem className={classes.textShadow} component={NavLink} to="/signup" color="inherit">
        Sign Up
      </MenuItem>
    </>
  );
}

export {SignedOutLinks};
