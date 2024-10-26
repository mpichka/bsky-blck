import { RootState } from "../../store";

export const getUserModerationList = (store: RootState) =>
  store.moderationList.data;
export const getSubscribedModerationList = (store: RootState) =>
  store.moderationList.subscribeData;
