export interface LoginPayload {
  handle: string;
  password: string;
}

export interface UserState {
  data: UserData | null;
  loading: boolean;
  initialized: boolean;
}

export interface UserData {
  accessJwt: string;
  refreshJwt: string;
  handle: string;
  did: string;
}
