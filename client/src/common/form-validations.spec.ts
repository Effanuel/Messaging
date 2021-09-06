import {buildFormValidator, Inputs, Values} from './form-validations';

describe('buildFormValidator', () => {
  it('should validate password', () => {
    const allInputs: Inputs[] = ['password'];
    const formValidator = buildFormValidator(allInputs);

    expect(formValidator({password: ''} as Values).password).toEqual('Password is required.');
    expect(formValidator({password: ','} as Values).password).toEqual('Password has to be atleast 6 characters long.');
    expect(formValidator({password: '12345'} as Values).password).toEqual(
      'Password has to be atleast 6 characters long.',
    );
    expect(formValidator({password: '123456'} as Values).password).toEqual(undefined);
  });

  it('should validate username', () => {
    const allInputs: Inputs[] = ['username'];
    const formValidator = buildFormValidator(allInputs);

    expect(formValidator({username: ''} as Values).username).toEqual('Username is required.');
    expect(formValidator({username: '3'} as Values).username).toEqual('Username has to be atleast 4 characters long.');
    expect(formValidator({username: '123'} as Values).username).toEqual(
      'Username has to be atleast 4 characters long.',
    );
    expect(formValidator({username: '1234'} as Values).username).toEqual(undefined);
    expect(formValidator({username: '12345abc'} as Values).username).toEqual(undefined);
  });
});
