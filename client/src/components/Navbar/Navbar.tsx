import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {AppBar, Toolbar, LinearProgress} from '@material-ui/core';
import {SignedInLinks} from './SignedInLinks';
import {SignedOutLinks} from './SignedOutLinks';
import {NavbarLogo} from './NavbarLogo';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {SearchBar} from 'components';

const useStyles = makeStyles((theme) => ({
  root: {flexGrow: 1, marginBottom: 10},
  title: {flexGrow: 1},
  appBar: {display: 'flex', flex: 1, backgroundColor: theme.palette.success.main, height: '5px'},
  emptyLoader: {height: 5},
}));

function Navbar() {
  const classes = useStyles();

  const {isLoggedIn, authLoading} = useReduxSelector('isLoggedIn', 'authLoading');

  return (
    <div className={classes.root}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <NavbarLogo />
          <SearchBar />
          {isLoggedIn ? <SignedInLinks /> : <SignedOutLinks />}
        </Toolbar>
      </AppBar>
      <div className={classes.appBar}></div>

      {authLoading ? <LinearProgress /> : <div className={classes.emptyLoader}></div>}
    </div>
  );
}

export {Navbar};
