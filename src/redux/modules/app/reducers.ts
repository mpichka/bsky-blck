import { Action } from "../../types";
import { CLEAR_ERROR, SET_ERROR } from "./actions";
import { AppState } from "./type";

const initialState: AppState = {
  error: null,
};

export function app(state = initialState, action: Action): AppState {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
}
