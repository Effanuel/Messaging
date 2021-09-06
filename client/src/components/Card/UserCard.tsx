import React from 'react';
import {makeStyles, Theme, createStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import {Switch} from '@material-ui/core';
import {useHistory} from 'react-router';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {backgroundColor: theme.palette.secondary.main, color: 'white', border: '1px solid grey', marginTop: 10},
    avatar: {backgroundColor: theme.palette.primary.main},
  }),
);

interface Props {
  id: string;
  name: string;
  isVerified: boolean;
  toggleVerify: (id: string, isVerified: boolean) => void;
}

export function UserCard({id, name, isVerified, toggleVerify}: Props) {
  const classes = useStyles();
  const history = useHistory();

  const toggle = React.useCallback((e: any, isVerified: boolean) => toggleVerify(id, isVerified), [toggleVerify, id]);

  const goToUserProfile = React.useCallback(() => history.push(`/user/${name}/${id}`), [history, name, id]);

  return (
    <Card className={classes.root}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar} onClick={goToUserProfile}>
            {name[0] ?? 'T'}
          </Avatar>
        }
        action={
          <div style={{marginTop: 10}}>
            <Switch
              checked={isVerified}
              onChange={toggle}
              color="primary"
              name="checkedB"
              inputProps={{'aria-label': 'primary checkbox'}}
            />
          </div>
        }
        title={name}
      />
    </Card>
  );
}
