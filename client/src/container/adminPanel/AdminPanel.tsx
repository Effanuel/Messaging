import {TextField} from '@material-ui/core';
import {Header, UserCard} from 'components';
import React from 'react';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {useDebouncedEffect} from 'redux/helpers/hooks';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {getUsers, verifyUser} from 'redux/modules/user/userModule';

function AdminPanel() {
  const dispatch = useDispatch();

  const [searchFilter, setSearchFilter] = React.useState('');

  const {users, profile} = useReduxSelector('users', 'profile');

  useDebouncedEffect(
    () => {
      dispatch(getUsers({searchFilter}));
    },
    300,
    [dispatch, searchFilter],
  );

  const toggleVerify = React.useCallback(
    (userId: string, isVerified: boolean) => {
      dispatch(verifyUser({userId, isVerified}));
    },
    [dispatch],
  );

  const updateSearchFilter = React.useCallback(({target: {value}}) => {
    setSearchFilter(value ?? '');
  }, []);

  if (profile?.isAuthAdmin !== undefined && profile?.isAdmin === false) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Header name="ADMIN PANEL" />
      <TextField
        label="Search users..."
        style={{color: 'white', border: '1px solid #02b89b', backgroundColor: '#121212'}}
        fullWidth
        margin="normal"
        InputLabelProps={{shrink: true, style: {color: 'white'}}}
        InputProps={{style: {color: 'white'}}}
        variant="filled"
        onChange={updateSearchFilter}
      />
      {!!users.length ? (
        users.map(({username, isVerified, id}) => (
          <UserCard key={id} id={id} name={username} isVerified={isVerified} toggleVerify={toggleVerify} />
        ))
      ) : (
        <div style={{color: 'white'}}>No users found.</div>
      )}
    </div>
  );
}

export default AdminPanel;
