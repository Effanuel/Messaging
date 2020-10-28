import React from 'react';
import {makeStyles, TextField} from '@material-ui/core';
import {useField} from 'formik';

const useStyles = makeStyles((theme) => {
  const {main} = theme.palette.primary;
  return {
    inputLabel: {color: 'grey'},
    underline: {
      color: 'white',
      '&:before': {borderBottom: `1px solid ${main}`},
      '&&&&:hover:before': {borderBottom: `1px solid ${main}`},
    },
  };
});

interface InputFieldProps {
  label: string;
  type?: 'text' | 'password';
  name: string;
}

function InputField(props: InputFieldProps) {
  const {name, label, type = 'text'} = props;

  const {inputLabel, underline} = useStyles();

  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';

  return (
    <TextField
      {...field}
      id={name}
      label={label}
      color="primary"
      type={type}
      InputLabelProps={{className: inputLabel}}
      InputProps={{classes: {underline}}}
      required
      helperText={errorText}
      error={!!errorText}
    />
  );
}

export {InputField};
