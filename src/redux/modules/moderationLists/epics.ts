import { combineEpics } from "redux-observable";

const THROTTLE_TIME = 200;

export const moderationListsEpics = combineEpics();
