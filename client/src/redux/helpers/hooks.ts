import _ from 'lodash';
import React from 'react';
import {Thunk} from 'redux/models/state';

export function useDispatcher(wrapper: (func: Thunk) => void, func: () => Thunk): (e: any) => void {
  return React.useCallback((e: any) => wrapper(func()), [wrapper, func]);
}

export const useDebounce = <S>(value: S, timeout: number) => {
  const [state, setState] = React.useState<S>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setState(value), timeout);
    return () => {
      clearTimeout(handler);
    };
  }, [value, timeout, state]);

  return state;
};
