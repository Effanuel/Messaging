import React from 'react';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {InputField, Form} from 'components';
import {clearAuthState, signUpUser} from 'redux/modules/auth/authModule';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {Values} from 'common/form-validations';

function SignUp() {
  const dispatch = useDispatch();

  const {authSignedUpSuccessfully} = useReduxSelector('authSignedUpSuccessfully');

  React.useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  const signUp = React.useCallback((values: Values) => dispatch(signUpUser(values)), [dispatch]);

  if (authSignedUpSuccessfully) {
    return <Redirect to="/signin" />;
  }

  return (
    <Form inputValues={{username: '', password: ''}} headerTitle="Sign up" submitCta="Sign up" onSubmit={signUp}>
      <InputField name="username" label="Username" />
      <InputField name="password" label="Password" type="password" />
    </Form>
  );
}
export default SignUp;
