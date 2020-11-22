import {makeStyles} from '@material-ui/core';
import React from 'react';

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
}));

function Header({label}: {label: string}) {
  const classes = useStyles();
  return <div className={classes.header}>{label}</div>;
}

export {Header};
