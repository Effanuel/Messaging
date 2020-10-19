import React from 'react';
import {Button, makeStyles, Typography} from '@material-ui/core';
import {Formik, Form as FormikForm} from 'formik';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {buildFormValidator, Inputs, Values} from 'common/form-validations';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: 50,
    '& > *': {margin: theme.spacing(1), width: '30ch'},
    display: 'flex',
    margin: 'auto',
    flexDirection: 'column',
    alignItems: 'center',
  },
  label: {display: 'flex', justifyContent: 'center', alignItems: 'center', textShadow: '2px 2px black'},
  inputLabel: {color: 'grey'},
}));

interface FormProps {
  headerTitle: string;
  submitCta: string;
  onSubmit: (values: Values) => void;
  children: any;
  inputValues: Partial<Values>;
}

const Form = React.memo(({headerTitle, submitCta, onSubmit, children, inputValues}: FormProps) => {
  const classes = useStyles();

  const {authError} = useReduxSelector('authError');

  const formValidator = React.useMemo(() => buildFormValidator(Object.keys(inputValues) as Inputs[]), [inputValues]);
  const validate = React.useCallback((values: Values) => formValidator(values), [formValidator]);

  return (
    <Formik initialValues={inputValues as Values} onSubmit={onSubmit} validate={validate} validateOnChange>
      {() => (
        <FormikForm className={classes.root}>
          <Typography variant="h4" className={classes.label} color="primary">
            {headerTitle}
          </Typography>
          {children}
          <div style={{height: 30}}>
            <Typography variant="subtitle1" className={classes.label} color="error">
              {authError}
            </Typography>
          </div>
          <Button variant="outlined" color="primary" type="submit">
            {submitCta}
          </Button>
        </FormikForm>
      )}
    </Formik>
  );
});

export {Form};
