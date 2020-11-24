import {Button, makeStyles} from '@material-ui/core';
import React from 'react';
import {useDispatch} from 'react-redux';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {followUser, unfollowUser} from 'redux/modules/message/messageModule';

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.primary.main}`,
    paddingLeft: 10,
    fontWeight: 500,
    fontSize: 22,
    height: 50,
  },
  label: {color: 'rgba(255, 255, 255, 0.6)', marginLeft: 10, marginRight: 10},
}));

interface Props {
  name: string;
  label?: string;
  userId?: string;
}

function Header({name, label, userId}: Props) {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {loggedInUserId, follProfile} = useReduxSelector('loggedInUserId', 'follProfile');

  const followUserAction = React.useCallback(() => {
    dispatch(followUser({followerId: loggedInUserId, userId: userId ?? ''}));
  }, [dispatch, loggedInUserId, userId]);

  const unfollowUserAction = React.useCallback(() => {
    dispatch(unfollowUser({followerId: loggedInUserId, userId: userId ?? ''}));
  }, [dispatch, loggedInUserId, userId]);

  return (
    <div className={classes.header}>
      {name}
      <div className={classes.label}>{label}</div>
      <div>
        {follProfile.isFollowing ? (
          <Button variant="contained" color="primary" size="small" onClick={unfollowUserAction}>
            Unfollow
          </Button>
        ) : (
          <Button variant="outlined" color="primary" size="small" onClick={followUserAction}>
            Follow
          </Button>
        )}
      </div>
    </div>
  );
}

export {Header};
