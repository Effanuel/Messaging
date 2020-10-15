import React from 'react';
import {Redirect} from 'react-router-dom';
import {Button, makeStyles, Typography} from '@material-ui/core';
import {useDispatch} from 'react-redux';
import {Formik, Form} from 'formik';
import {InputField} from '../../components';
import {signInUser} from 'redux/modules/auth/authModule';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {buildFormValidator, Values} from 'common/form-validations';

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

const formValidator = buildFormValidator(['email', 'password']);

function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {authError, isLoggedIn} = useReduxSelector('authError', 'isLoggedIn');

  const validate = React.useCallback((values: Values) => formValidator(values), []);

  const signIn = React.useCallback(
    (values: Values) => {
      dispatch(signInUser(values));
    },
    [dispatch],
  );

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Formik initialValues={{email: '', password: ''} as Values} onSubmit={signIn} validate={validate} validateOnChange>
      {() => (
        <Form className={classes.root}>
          <Typography variant="h4" className={classes.label} color="primary">
            Sign in
          </Typography>
          <InputField name="email" label="Email" />
          <InputField name="password" label="Password" type="password" />
          <div style={{height: 30}}>
            <Typography variant="subtitle1" className={classes.label} color="error">
              {authError}
            </Typography>
          </div>
          <Button variant="outlined" color="primary" type="submit">
            Sign in
          </Button>
        </Form>
      )}
    </Formik>
  );
}
export default SignIn;
