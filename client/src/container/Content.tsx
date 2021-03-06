import React from 'react';
import {Route, Switch} from 'react-router-dom';
import SignIn from 'container/auth/SignIn';
import SignUp from 'container/auth/SignUp';
import Home from 'container/home/Home';
import Profile from 'container/profile/Profile';
import NotFound from 'container/notFound/NotFound';
import AdminPanel from './adminPanel/AdminPanel';
import TagSearch from './searchesByTag/TagSearch';

function Content() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/user/:name/:id" component={Profile} />
      <Route path="/searchByTag/:tag" component={TagSearch} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/admin" component={AdminPanel} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default Content;
