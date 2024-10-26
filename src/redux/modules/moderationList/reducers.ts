import { Action } from "../../types";
import {
  CLEAR_MODERATION_LIST,
  PUSH_TO_MODERATION_LIST,
  PUSH_TO_SUBSCRIBED_MODERATION_LIST,
} from "./actions";
import type { ModerationListsState } from "./type";

const initialState: ModerationListsState = {
  data: [],
  subscribeData: [],
};

export function moderationList(
  state = initialState,
  action: Action
): ModerationListsState {
  switch (action.type) {
    case CLEAR_MODERATION_LIST:
      return initialState;
    case PUSH_TO_MODERATION_LIST:
      return {
        data: [...state.data, ...action.payload],
        subscribeData: state.subscribeData,
      };
    case PUSH_TO_SUBSCRIBED_MODERATION_LIST:
      return {
        data: state.data,
        subscribeData: [...state.subscribeData, ...action.payload],
      };
    default:
      return state;
  }
}
