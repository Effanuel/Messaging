import React from 'react';
import {Redirect} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {InputField, Form} from 'components';
import {clearAuthState, signInUser} from 'redux/modules/auth/authModule';
import {useReduxSelector} from 'redux/helpers/selectorHelper';
import {Values} from 'common/form-validations';

function SignIn() {
  const dispatch = useDispatch();

  const {authenticated} = useReduxSelector('authenticated');

  React.useEffect(() => {
    dispatch(clearAuthState());
  }, [dispatch]);

  const signIn = React.useCallback(
    (values: Values) => {
      dispatch(signInUser(values));
    },
    [dispatch],
  );

  if (authenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Form inputValues={{username: '', password: ''}} headerTitle="Sign in" submitCta="Sign in" onSubmit={signIn}>
      <InputField name="username" label="Username" />
      <InputField name="password" label="Password" type="password" />
    </Form>
  );
}
export default SignIn;
