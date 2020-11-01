import React from 'react';
import {Route, Switch} from 'react-router-dom';
import {Navbar} from './components';
import SignIn from 'container/auth/SignIn';
import SignUp from 'container/auth/SignUp';
import Home from 'container/home/Home';
import Profile from 'container/profile/Profile';

const App = React.memo(() => {
  return (
    <>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/user/:id" component={Profile} />
        <Route path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
      </Switch>
    </>
  );
});

export default App;
