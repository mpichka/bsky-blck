import type { StateObservable } from 'redux-observable';
import type { Observable } from 'rxjs';
import type { RootState } from './store';

export type ServerException = {
  status: string;
  statusCode: number;
  message: string;
  messageCode: number;
};

export type Action = {
  type: string;
  payload?: any;
  error?: ServerException;
  success?: string;
};

export type EpicAction = Observable<{
  type: string;
  payload?: any;
  error?: ServerException;
  success?: string;
  cb?: (...args: any[]) => void;
}>;

export type EpicRootState = StateObservable<RootState>;
