import React from 'react';
import {Button, makeStyles, Typography} from '@material-ui/core';
import {Formik, Form} from 'formik';
import {InputField} from '../../components';
import {useDispatch} from 'react-redux';
import {signUpUser} from 'redux/modules/auth/authModule';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {buildFormValidator, Values} from 'common/form-validations';
import {Redirect} from 'react-router-dom';

const formValidator = buildFormValidator(['email', 'password']);

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

function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const {authError, authSignedUpSuccessfully} = useReduxSelector('authError', 'authSignedUpSuccessfully');

  const validate = React.useCallback((values: Values) => formValidator(values), []);

  const signUp = React.useCallback(
    (values: Values) => {
      dispatch(signUpUser(values));
    },
    [dispatch],
  );

  console.log(authSignedUpSuccessfully, '----');

  if (authSignedUpSuccessfully) {
    return <Redirect to="/signin" />;
  }

  return (
    <Formik
      initialValues={{username: '', email: '', password: ''}}
      onSubmit={signUp}
      validate={validate}
      validateOnChange
    >
      {() => (
        <Form className={classes.root}>
          <Typography variant="h4" className={classes.label} color="primary">
            Sign up
          </Typography>

          <InputField name="username" label="Username" />
          <InputField name="email" label="Email" />
          <InputField name="password" label="Password" type="password" />
          <div style={{height: 30}}>
            <Typography variant="subtitle1" className={classes.label} color="error">
              {authError}
            </Typography>
          </div>
          <Button variant="outlined" color="primary" type="submit">
            Sign up
          </Button>
        </Form>
      )}
    </Formik>
  );
}
export default SignUp;
