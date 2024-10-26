import type { List } from "../../../services/Bsky";

export const PUSH_TO_MODERATION_LIST = "PUSH_MODERATION_LIST";
export const pushToModerationList = (payload: List[]) => ({
  type: PUSH_TO_MODERATION_LIST,
  payload,
});

export const CLEAR_MODERATION_LIST = "CLEAR_MODERATION_LIST";
export const clearModerationList = () => ({ type: CLEAR_MODERATION_LIST });

export const PUSH_TO_SUBSCRIBED_MODERATION_LIST = "PUSH_TO_SUBSCRIBED_MODERATION_LIST";
export const pushToSubscribedModerationList = (payload: List[]) => ({
  type: PUSH_TO_SUBSCRIBED_MODERATION_LIST,
  payload,
});
