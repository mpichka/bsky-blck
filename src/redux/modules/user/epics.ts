import { combineEpics, ofType } from "redux-observable";
import { catchError, from, map, of, switchMap, throttleTime } from "rxjs";
import { Bsky } from "../../../services/Bsky";
import type { EpicAction } from "../../types";
import { CLEAR_USER, INITIALIZE, LOGIN, LOGOUT, SET_USER } from "./actions";

const THROTTLE_TIME = 200;

const loginEpic = (action$: EpicAction) =>
  action$.pipe(
    ofType(LOGIN),
    throttleTime(THROTTLE_TIME),
    switchMap(({ payload }) => {
      const session = JSON.parse(sessionStorage.getItem("session")!);

      if (session) {
        return of({
          type: SET_USER,
          payload: session,
        });
      }

      return from(
        Bsky.authenticate(payload.handle.trim(), payload.password.trim())
      ).pipe(
        map((response) => {
          if (response.data) {
            sessionStorage.setItem("session", JSON.stringify(response.data));
            return {
              type: SET_USER,
              payload: response.data,
            };
          } else {
            sessionStorage.removeItem("session");
            return {
              type: CLEAR_USER,
              error: response.error?.message || response.error,
            };
          }
        }),
        catchError((error) =>
          of({ type: CLEAR_USER, error: error?.message || error })
        )
      );
    })
  );

const initializeEpic = (action$: EpicAction) =>
  action$.pipe(
    ofType(INITIALIZE),
    map(() => {
      const session = JSON.parse(sessionStorage.getItem("session")!);

      if (session) {
        return {
          type: SET_USER,
          payload: session,
        };
      } else {
        return {
          type: CLEAR_USER,
        };
      }
    })
  );

const logoutEpic = (action$: EpicAction) =>
  action$.pipe(
    ofType(LOGOUT),
    map(() => {
      sessionStorage.removeItem("session");
      return {
        type: CLEAR_USER,
      };
    })
  );

export const userEpics = combineEpics(loginEpic, initializeEpic, logoutEpic);
