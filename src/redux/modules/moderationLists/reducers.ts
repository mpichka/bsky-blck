import { Action } from "../../types";
import type { ModerationListsState } from "./type";

const initialState: ModerationListsState = {
  data: [],
  loading: false,
  initialized: false,
};

export function moderationLists(
  state = initialState,
  action: Action
): ModerationListsState {
  switch (action.type) {
    default:
      return state;
  }
}
