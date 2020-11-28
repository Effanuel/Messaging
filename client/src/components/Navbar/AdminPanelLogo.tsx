import React from 'react';
import {Link} from 'react-router-dom';
import {makeStyles, MenuItem, Typography} from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';

const useStyles = makeStyles((theme) => ({
  title: {flexGrow: 1, textShadow: '1px 1px black'},
}));

function AdminPanelLogo() {
  const classes = useStyles();
  return (
    <>
      <MenuItem component={Link} to="/admin">
        <CodeIcon />
      </MenuItem>
      <Typography variant="h6" className={classes.title}>
        Admin Panel
      </Typography>
    </>
  );
}

export {AdminPanelLogo};
