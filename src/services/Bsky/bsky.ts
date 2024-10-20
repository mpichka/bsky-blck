import { fetch } from "../EasyFetch";
import type {
  AuthenticationResponse,
  AuthorFeedResponse,
  AuthorResponse,
  FollowersResponse,
  LikesResponse,
  RepostsResponse,
} from "./types";

export class Bsky {
  LIMIT = 100;
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

  async getAuthor(handleOrDid: string) {
    return await fetch.get<AuthorResponse>(
      "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile",
      {
        query: {
          actor: handleOrDid,
        },
      }
    );
  }

  async getAuthorFollowers(
    did: string,
    cursor: string | null | undefined = undefined
  ) {
    return await fetch.get<FollowersResponse>(
      "https://public.api.bsky.app/xrpc/app.bsky.graph.getFollowers",
      {
        query: {
          actor: did,
          cursor,
          limit: this.LIMIT,
        },
      }
    );
  }

  async getAuthorFeed(did: string, cursor: string | undefined = undefined) {
    return await fetch.get<AuthorFeedResponse>(
      "https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed",
      {
        query: {
          actor: did,
          cursor,
          limit: this.LIMIT,
        },
      }
    );
  }

  async getPostLikes(uri: string, cursor: string | undefined = undefined) {
    return await fetch.get<LikesResponse>(
      "https://public.api.bsky.app/xrpc/app.bsky.feed.getLikes",
      {
        query: {
          uri,
          cursor,
          limit: this.LIMIT,
        },
      }
    );
  }

  async getPostReposts(uri: string, cursor: string | undefined = undefined) {
    return await fetch.get<RepostsResponse>(
      "https://public.api.bsky.app/xrpc/app.bsky.feed.getRepostedBy",
      {
        query: {
          uri,
          cursor,
          limit: this.LIMIT,
        },
      }
    );
  }

  async blockUser(did: string, session: AuthenticationResponse) {
    return await fetch.post("https://bsky.social/xrpc/com.atproto.repo.createRecord", {
      authorization: session.accessJwt,
      body: {
        collection: "app.bsky.graph.block",
        repo: session.did,
        record: {
          subject: did,
          createdAt: new Date().toISOString(),
          $type: "app.bsky.graph.block",
        },
      },
    });
  }
}
