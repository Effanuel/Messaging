import _ from 'lodash';
import React from 'react';
import {Thunk} from 'redux/models/state';

export function useDispatcher(wrapper: (func: Thunk) => void, func: () => Thunk): (e: any) => void {
  return React.useCallback((e: any) => wrapper(func()), [wrapper, func]);
}

export const useDebouncedEffect = (effect: any, delay: number, deps: any) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const callback = React.useCallback(effect, deps);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [callback, delay]);
};
