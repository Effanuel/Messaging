import _ from 'lodash/fp';

const isRequired = (value: string): boolean => !!value;

const isEmailValid = (value: string) => /^[A-Z0-9._%+-]+@[A-Z0-9]+\.[A-Z]{2,}$/i.test(value);

const isLongEnough = (length: number) => (value: string) => value.length >= length;

type Validations = {
  [key in Inputs]: {validate: (values: string) => boolean; errorMessage: string}[];
};

const validations: Validations = {
  //   email: [
  //     {validate: isRequired, errorMessage: 'Email is required.'},
  //     {validate: isEmailValid, errorMessage: 'Invalid email address.'},
  //   ],
  password: [
    {validate: isRequired, errorMessage: 'Password is required.'},
    {validate: isLongEnough(6), errorMessage: 'Password has to be atleast 6 characters long.'},
  ],
  username: [
    {validate: isRequired, errorMessage: 'Username is required.'},
    {validate: isLongEnough(4), errorMessage: 'Username has to be atleast 4 characters long.'},
  ],
};

export interface Values {
  [key: string]: string;
  //   email: string;
  password: string;
  username: string;
}

export type Inputs = 'password' | 'username';

export function buildFormValidator(inputs: Inputs[]) {
  const selectedValidations: Validations = _.pick(inputs, validations);

  return (values: Values) => {
    const errors: Partial<Values> = {};
    Object.keys(selectedValidations).forEach((validation) => {
      for (const entry of selectedValidations[validation as Inputs]) {
        if (!entry.validate(values[validation] as string)) {
          errors[validation] = entry.errorMessage;
          break;
        }
      }
    });
    return errors;
  };
}
