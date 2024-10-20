export interface AuthenticationResponse {
  accessJwt: string;
  refreshJwt: string;
  handle: string;
  did: string;
}
