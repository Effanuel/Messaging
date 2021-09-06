import _ from 'lodash';
import React from 'react';
import {CardListContainer, Header} from 'components';
import {RouteComponentProps} from 'react-router-dom';
import {Button} from '@material-ui/core';
import {useDispatch, useSelector} from 'react-redux';
import {followUser, unfollowUser} from 'redux/modules/message/messageModule';
import {AppState} from 'redux/models/state';

export default function Profile({match}: RouteComponentProps<{id: string; name: string}>) {
  const {name, id} = match.params;
  const dispatch = useDispatch();

  const userId = useSelector((state: AppState) => state.auth.id);
  const authenticated = useSelector((state: AppState) => state.auth.authenticated);
  const userProfile = useSelector((state: AppState) => state.message.profile);

  const followUserAction = React.useCallback(() => dispatch(followUser({userId: id})), [dispatch, id]);
  const unfollowUserAction = React.useCallback(() => dispatch(unfollowUser({userId: id})), [dispatch, id]);

  return (
    <>
      <Header name="PROFILE" label={name} isVerified={userProfile?.isVerified}>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          {!authenticated || id === userId ? null : userProfile.isFollowing ? (
            <Button variant="contained" color="primary" size="small" onClick={unfollowUserAction}>
              Unfollow
            </Button>
          ) : (
            <Button variant="outlined" color="primary" size="small" onClick={followUserAction}>
              Follow
            </Button>
          )}
          <div style={{fontSize: 14, paddingLeft: 10}}>Follower count: {userProfile.followerCount}</div>
        </div>
      </Header>
      <CardListContainer query="userMessages" emptyCta="This user hasn`t posted any messages yet." userId={id} />
    </>
  );
}
