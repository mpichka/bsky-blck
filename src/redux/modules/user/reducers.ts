import { Action } from "../../types";
import { CLEAR_USER, LOGIN, LOGOUT, SET_USER } from "./actions";
import type { UserState } from "./type";

const initialState: UserState = {
  data: null,
  loading: false,
  initialized: false,
};

export function user(state = initialState, action: Action): UserState {
  switch (action.type) {
    case LOGIN:
    case LOGOUT:
      return { ...initialState, loading: true };
    case SET_USER:
      return {
        data: action.payload,
        loading: false,
        initialized: true,
      };
    case CLEAR_USER:
      return { ...initialState, initialized: true, loading: false };
    default:
      return state;
  }
}
