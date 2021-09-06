import {AsyncThunk, createAsyncThunk} from '@reduxjs/toolkit';
import {AppState} from 'redux/models/state';

export const withPayloadType =
  <T>() =>
  (payload: T) => ({payload});

export interface ThunkApiConfig {
  rejected: string;
  rejectValue: string;
  state: AppState;
}

export function createThunk<P, Returned = any>(
  actionName: any,
  request: (payload: P, getState: () => AppState) => Promise<any>,
): AsyncThunk<Returned, P, ThunkApiConfig> {
  return createAsyncThunk<Returned, P, ThunkApiConfig>(actionName, async (payload: P, {rejectWithValue, getState}) => {
    try {
      return await request(payload, getState);
    } catch (error: any) {
      return rejectWithValue(error.response?.data.error);
    }
  });
}
