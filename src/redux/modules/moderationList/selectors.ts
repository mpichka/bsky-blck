import { RootState } from "../../store";

export const getModerationList = (store: RootState) =>
  store.moderationList.data;
