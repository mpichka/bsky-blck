import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { appEpics } from "./app/epics";
import { app } from "./app/reducers";
import { userEpics } from "./user/epics";
import { user } from "./user/reducers";

export const rootEpic = combineEpics(appEpics, userEpics);

export const rootReducer = combineReducers({
  app,
  user,
});
