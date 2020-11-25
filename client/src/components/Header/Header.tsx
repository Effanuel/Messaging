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
  label: {color: 'rgba(255, 255, 255, 0.6)', marginLeft: 10, marginRight: 10},
}));

interface Props {
  name: string;
  label?: string;
  children?: React.ReactNode;
}

function Header({name, label, children}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      {name}
      <div className={classes.label}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

export {Header};
