import { fetch } from "../EasyFetch";
import type {
  AuthenticationResponse,
  AuthorFeedResponse,
  AuthorResponse,
  FollowersResponse,
  LikesResponse,
  ModerationListResponse,
  NewListResponse,
  RepostsResponse,
} from "./types";

export class Bsky {
  private static LIMIT = 100;
  static async authenticate(handle: string, pass: string) {
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

  static async getAuthor(handleOrDid: string) {
    return await fetch.get<AuthorResponse>(
      "https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile",
      {
        query: {
          actor: handleOrDid,
        },
      }
    );
  }

  static async getAuthorFollowers(
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

  static async getAuthorFeed(
    did: string,
    cursor: string | undefined = undefined
  ) {
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

  static async getPostLikes(
    uri: string,
    cursor: string | undefined = undefined
  ) {
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

  static async getPostReposts(
    uri: string,
    cursor: string | undefined = undefined
  ) {
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

  static async blockUser(did: string, session: AuthenticationResponse) {
    return await fetch.post(
      "https://bsky.social/xrpc/com.atproto.repo.createRecord",
      {
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
      }
    );
  }

  static async muteUser(did: string, session: AuthenticationResponse) {
    return await fetch.post(
      "https://bsky.social/xrpc/app.bsky.graph.muteActor",
      {
        authorization: session.accessJwt,
        body: {
          actor: did,
        },
      }
    );
  }

  static async createModerationList(session: AuthenticationResponse) {
    return await fetch.post<NewListResponse>(
      "https://bsky.social/xrpc/com.atproto.repo.createRecord",
      {
        authorization: session.accessJwt,
        body: {
          collection: "app.bsky.graph.list",
          repo: session.did,
          record: {
            purpose: "app.bsky.graph.defs#modlist",
            name: session.handle + "'s moderation list",
            description: "Created with https://blsky-chainblock.vercel.app/",
            createdAt: new Date().toISOString(),
            $type: "app.bsky.graph.list",
          },
        },
      }
    );
  }

  static async addUserToTheModerationList(
    did: string,
    listUri: string,
    session: AuthenticationResponse
  ) {
    return await fetch.post(
      "https://bsky.social/xrpc/com.atproto.repo.createRecord",
      {
        authorization: session.accessJwt,
        body: {
          collection: "app.bsky.graph.listitem",
          repo: session.did,
          record: {
            subject: did,
            list: listUri,
            createdAt: new Date().toISOString(),
            $type: "app.bsky.graph.listitem",
          },
        },
      }
    );
  }

  static async getUserModerationLists(
    session: AuthenticationResponse,
    cursor: string | undefined = undefined
  ) {
    return await fetch.get<ModerationListResponse>(
      "https://public.api.bsky.app/xrpc/app.bsky.graph.getLists",
      {
        query: {
          actor: session.did,
          cursor,
          limit: this.LIMIT,
        },
      }
    );
  }

  static async getSubscribedBlockList(
    session: AuthenticationResponse,
    cursor: string | undefined = undefined
  ) {
    return await fetch.get<ModerationListResponse>(
      "https://bsky.social/xrpc/app.bsky.graph.getListBlocks",
      {
        authorization: session.accessJwt,
        query: {
          actor: session.did,
          cursor,
          limit: this.LIMIT,
        },
      }
    );
  }
  static async getSubscribedMuteList(
    session: AuthenticationResponse,
    cursor: string | undefined = undefined
  ) {
    return await fetch.get<ModerationListResponse>(
      "https://bsky.social/xrpc/app.bsky.graph.getListMutes",
      {
        authorization: session.accessJwt,
        query: {
          actor: session.did,
          cursor,
          limit: this.LIMIT,
        },
      }
    );
  }
}
