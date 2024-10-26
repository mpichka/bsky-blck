import type { LoginPayload } from "./type";

export const SET_USER = "SET_USER";
export const CLEAR_USER = "CLEAR_USER";

export const LOGIN = "LOGIN";
export const login = (payload: LoginPayload) => ({ type: LOGIN, payload });

export const LOGOUT = "LOGOUT";
export const logout = () => ({ type: LOGOUT });

export const INITIALIZE = "INITIALIZE";
export const init = () => ({ type: INITIALIZE });
