import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import {SignedInLinks} from './SignedInLinks';
import {SignedOutLinks} from './SignedOutLinks';
import {NavbarLogo} from './NavbarLogo';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {LinearProgress} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {flexGrow: 1, marginBottom: 10},
  title: {flexGrow: 1},
}));

function Navbar() {
  const classes = useStyles();

  const {isLoggedIn, authLoading} = useReduxSelector('isLoggedIn', 'authLoading');

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <NavbarLogo />
          {isLoggedIn ? <SignedInLinks /> : <SignedOutLinks />}
        </Toolbar>
      </AppBar>
      {authLoading ? <LinearProgress /> : <div style={{height: 5}}></div>}
    </div>
  );
}

export {Navbar};
