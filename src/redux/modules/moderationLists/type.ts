import { List } from '../../../services/Bsky';

export interface ModerationListsState {
  data: List[];
  loading: boolean;
  initialized: boolean;
}
