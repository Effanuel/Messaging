import React from 'react';
import {Route, Switch} from 'react-router-dom';
import SignIn from 'container/auth/SignIn';
import SignUp from 'container/auth/SignUp';
import Home from 'container/home/Home';
import Profile from 'container/profile/Profile';

function Content() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/user/:name/:id" component={Profile} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
    </Switch>
  );
}

export default Content;
