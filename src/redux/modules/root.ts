import { combineReducers } from "redux";
import { combineEpics } from "redux-observable";
import { appEpics } from "./app/epics";
import { app } from "./app/reducers";
import { moderationListsEpics } from "./moderationLists/epics";
import { moderationLists } from "./moderationLists/reducers";
import { userEpics } from "./user/epics";
import { user } from "./user/reducers";

export const rootEpic = combineEpics(appEpics, moderationListsEpics, userEpics);

export const rootReducer = combineReducers({
  app,
  user,
  moderationLists,
});
