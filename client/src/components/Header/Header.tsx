import React from 'react';
import {Chip, makeStyles} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

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
  isVerified?: boolean;
}

function Header({name, label, children, isVerified}: Props) {
  const classes = useStyles();

  return (
    <div className={classes.header}>
      {name}
      <div className={classes.label}>{label}</div>
      {isVerified && (
        <Chip color="primary" size="small" icon={<CheckIcon />} label="Verified" style={{marginRight: 10}} />
      )}
      <div>{children}</div>
    </div>
  );
}

export {Header};
