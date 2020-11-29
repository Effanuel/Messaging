import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Grid, LinearProgress} from '@material-ui/core';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {AdminPanelLogo, UserSearchBar, TagSearchBar, SignedInLinks, SignedOutLinks} from 'components';
import Content from 'container/Content';
import {NavbarLogo} from 'components/Navbar/NavbarLogo';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    marginBottom: 10,
    color: '#02b89b',
    height: '1500px',
    justifyContent: 'flex-end',
  },
  appBar: {display: 'flex', flex: 1, height: '5px'},
  emptyLoader: {height: 5},
  section: {display: 'flex', padding: 10, alignItems: 'center'},
  container: {backgroundColor: '#1c1c1c'},
  test: {
    display: 'flex',
    flexDirection: 'column',
    padding: 10,
    '& > *': {marginBottom: 20},
  },
}));

function App() {
  const classes = useStyles();

  const {isLoggedIn, authLoading, profile} = useReduxSelector('isLoggedIn', 'authLoading', 'profile');

  return (
    <div className={classes.root}>
      <Grid container justify="center">
        <Grid item xs={2}>
          <div className={classes.section}>
            <NavbarLogo />
          </div>
          {profile?.isAdmin === true ? (
            <div className={classes.section}>
              <AdminPanelLogo />
            </div>
          ) : null}
        </Grid>

        <Grid item xs={4}>
          {authLoading ? <LinearProgress /> : <div className={classes.emptyLoader}></div>}
          <Content />
        </Grid>

        <Grid item xs={2}>
          <div className={classes.test}>
            <UserSearchBar />
            <TagSearchBar />
            {isLoggedIn ? <SignedInLinks /> : <SignedOutLinks />}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
