import _ from 'lodash';
import React from 'react';
import {CardListContainer, Header} from 'components';
import {RouteComponentProps} from 'react-router-dom';
import {Button} from '@material-ui/core';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {useDispatch} from 'react-redux';
import {followUser, unfollowUser} from 'redux/modules/message/messageModule';

function Profile({match}: RouteComponentProps<{id: string; name: string}>) {
  const {name, id} = match.params;
  const dispatch = useDispatch();

  const {follProfile, isLoggedIn} = useReduxSelector('follProfile', 'isLoggedIn');

  const followUserAction = React.useCallback(() => {
    dispatch(followUser({userId: id ?? ''}));
  }, [dispatch, id]);

  const unfollowUserAction = React.useCallback(() => {
    dispatch(unfollowUser({userId: id ?? ''}));
  }, [dispatch, id]);

  return (
    <>
      <Header name="PROFILE" label={name}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          {!isLoggedIn ? null : follProfile.isFollowing ? (
            <Button variant="contained" color="primary" size="small" onClick={unfollowUserAction}>
              Unfollow
            </Button>
          ) : (
            <Button variant="outlined" color="primary" size="small" onClick={followUserAction}>
              Follow
            </Button>
          )}
          <div style={{fontSize: 14, paddingLeft: 10}}>Follower count: {follProfile.followerCount}</div>
        </div>
      </Header>
      <CardListContainer query="userMessages" userId={id ?? ''} emptyCta="This user hasn`t posted any messages yet." />
    </>
  );
}

export default Profile;
