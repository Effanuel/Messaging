import React from 'react';
import {Link} from 'react-router-dom';
import {makeStyles, MenuItem, Typography} from '@material-ui/core';
import MessageIcon from '@material-ui/icons/Mms';

const useStyles = makeStyles((theme) => ({
  title: {flexGrow: 1, textShadow: '1px 1px black'},
}));

function NavbarLogo() {
  const classes = useStyles();
  return (
    <>
      <MenuItem component={Link} to="/">
        <MessageIcon />
      </MenuItem>
      <Typography variant="h6" className={classes.title}>
        Messaging
      </Typography>
    </>
  );
}

export {NavbarLogo};
