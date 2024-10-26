import { combineEpics } from "redux-observable";
import { filter, map } from "rxjs";
import type { EpicAction } from "../../types";
import { SET_ERROR } from "./actions";

const setError = (action$: EpicAction) =>
  action$.pipe(
    filter((action) => Boolean(action.error)),
    map(({ error }) => ({ type: SET_ERROR, payload: error }))
  );

export const appEpics = combineEpics(setError);
