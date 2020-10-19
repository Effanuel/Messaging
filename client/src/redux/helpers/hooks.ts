import React from 'react';
import {Thunk} from 'redux/models/state';

export function useDispatcher(wrapper: (func: Thunk) => void, func: () => Thunk): (e: any) => void {
  return React.useCallback((e: any) => wrapper(func()), [wrapper, func]);
}
