import { fetch } from "../EasyFetch";
import type { AuthenticationResponse } from "./types";

export class Bsky {
  async authenticate(handle: string, pass: string) {
    return await fetch.post<AuthenticationResponse>(
      "https://bsky.social/xrpc/com.atproto.server.createSession",
      {
        body: {
          identifier: handle,
          password: pass,
        },
      }
    );
  }
}
