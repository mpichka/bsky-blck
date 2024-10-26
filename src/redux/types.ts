import type { StateObservable } from 'redux-observable';
import type { Observable } from 'rxjs';
import type { RootState } from './store';

export type Action = {
  type: string;
  payload?: any;
  error?: string;
};

export type EpicAction = Observable<{
  type: string;
  payload?: any;
  error?: string;
}>;

export type EpicRootState = StateObservable<RootState>;
