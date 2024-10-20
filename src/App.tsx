import { type MutableRefObject, useEffect, useRef, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Row from "react-bootstrap/Row";
import { Counter } from "./components/Counter";
import { LoginForm } from "./components/LoginForm";
import { LogoutButton } from "./components/LogoutButton";
import { LogsOutput } from "./components/Output";
import { SearchInput, SearchInputFormData } from "./components/SearchInput";
import {
  AuthenticationResponse,
  AuthorResponse,
  Bsky,
  Post,
} from "./services/Bsky";
import { parseSearchString } from "./utils/parseSearchString";

export default function App() {
  const bskyRef: MutableRefObject<Bsky> = useRef(new Bsky());

  // Map<handle, did>
  const authorRef = useRef<AuthorResponse | null>(null);
  const authorPostRef = useRef<Post | null>(null);
  const postLikesRef = useRef(new Map<string, string>());
  const postRepostRef = useRef(new Map<string, string>());
  const authorFollowersRef = useRef(new Map<string, string>());
  const likesFollowersRef = useRef(new Map<string, string>());
  const repostsFollowersRef = useRef(new Map<string, string>());
  const [totalCount, setTotalCount] = useState(new Set<string>());
  const [blockCount, setBlockCount] = useState(new Set<string>());
  const [logs, setLogs] = useState("");
  const [isAuthenticated, setAuthenticated] = useState(
    Boolean(sessionStorage.getItem("session"))
  );
  const [isLoading, setLoading] = useState(false);
  const [createBlockList, setCreateBlockList] = useState(false);

  useEffect(() => {
    if (!isLoading && totalCount.size && !blockCount.size) {
      if (createBlockList) executeCreationOfBlockList();
      else executeSimpleBlocks();
    }
  }, [isLoading, totalCount, createBlockList, blockCount]);

  const log = (message: string) => {
    setLogs((prevLog) => prevLog + message + "\n");
  };

  const logError = ({ error }) => {
    setLogs((prevLog) => "ERROR: " + prevLog + error?.message || error + "\n");
  };

  const addToTotalCount = (did: string) => {
    setTotalCount((previousState) => new Set([...previousState, did]));
  };

  const addToBlockCount = (did: string) => {
    setBlockCount((previousState) => new Set([...previousState, did]));
  };

  const handleChainBlock = async (formData: SearchInputFormData) => {
    setLoading(true);
    setTotalCount(new Set());
    setLogs(() => "");
    setCreateBlockList(formData.createBlockList);

    if (!formData.linkToPost) {
      setLoading(false);
      return log("Search string is empty!");
    }

    await addAuthor(formData);

    if (formData.includeAuthorFollowers) await addAuthorFollowers();
    if (formData.includeLikes) await addPostLikes(authorPostRef.current);
    if (formData.includeReposts) await addPostReposts(authorPostRef.current);
    if (formData.includeLikesFollowers)
      await addPostLikesFollowers(authorPostRef.current);
    if (formData.includeRepostFollowers)
      await addPostRepostsFollowers(authorPostRef.current);
    if (formData.repeatForAuthor) await repeatForAuthor(formData);

    setLoading(false);
  };

  async function addAuthor(formData: SearchInputFormData) {
    const starterPoint = parseSearchString(formData.linkToPost);

    log("Fetching author");
    const authorRes = await bskyRef.current.getAuthor(starterPoint.author);
    if (!authorRes.data) {
      return logError(authorRes.error);
    } else {
      authorRef.current = authorRes.data;
      addToTotalCount(authorRes.data.did);
    }

    if (
      formData.includeLikes ||
      formData.includeLikesFollowers ||
      formData.includeReposts ||
      formData.includeRepostFollowers
    ) {
      log("Fetching author post");
      let cursor: string | undefined;
      while (true) {
        const postsRes = await bskyRef.current.getAuthorFeed(
          authorRef.current.did,
          cursor
        );

        if (!postsRes.data) {
          logError(postsRes.error);
          break;
        } else {
          authorPostRef.current =
            postsRes.data.feed.find(
              (feedItem) =>
                feedItem.post.uri.split("/").pop() === starterPoint.postId
            )?.post || null;
        }

        cursor = postsRes.data?.cursor;
        if (!cursor || authorPostRef.current) break;
      }
    }
  }

  async function addAuthorFollowers() {
    if (authorRef.current) {
      log("Fetching author followers");
      let cursor: string | undefined;
      while (true) {
        const followersRes = await bskyRef.current.getAuthorFollowers(
          authorRef.current.did,
          cursor
        );

        if (followersRes.error) {
          logError(followersRes.error);
          break;
        }

        followersRes.data?.followers.forEach((follower) => {
          authorFollowersRef.current.set(follower.handle, follower.did);
          addToTotalCount(follower.did);
        });

        cursor = followersRes.data?.cursor;
        if (!cursor || !followersRes.data?.followers.length) break;
      }
    }
  }

  async function addPostLikes(post: Post | null) {
    if (!post) return;

    log("Fetching post likes");
    let cursor: string | undefined;
    while (true) {
      const postLikesRes = await bskyRef.current.getPostLikes(post.uri, cursor);

      if (!postLikesRes.data) {
        logError(postLikesRes.error);
        break;
      } else {
        postLikesRes.data.likes.forEach((like) => {
          postLikesRef.current.set(like.actor.handle, like.actor.did);
          addToTotalCount(like.actor.did);
        });
      }

      cursor = postLikesRes.data?.cursor;
      if (!cursor || postLikesRes.data?.likes?.length) break;
    }
  }

  async function addPostReposts(post: Post | null) {
    if (!post) return;

    log("Fetching post reposts");
    let cursor: string | undefined;
    while (true) {
      const postLikesRes = await bskyRef.current.getPostReposts(
        post.uri,
        cursor
      );

      if (!postLikesRes.data) {
        logError(postLikesRes.error);
        break;
      } else {
        postLikesRes.data.repostedBy.forEach((repost) => {
          postRepostRef.current.set(repost.handle, repost.did);
          addToTotalCount(repost.did);
        });
      }

      cursor = postLikesRes.data?.cursor;
      if (!cursor || postLikesRes.data?.repostedBy?.length) break;
    }
  }

  async function addPostLikesFollowers(post: Post | null) {
    if (!post) return;

    log("Fetching post likes followers");
    for (const userDid of postLikesRef.current.values()) {
      let cursor: string | undefined;
      while (true) {
        const followersRes = await bskyRef.current.getAuthorFollowers(
          userDid,
          cursor
        );

        if (followersRes.error) {
          logError(followersRes.error);
          break;
        }

        followersRes.data?.followers.forEach((follower) => {
          likesFollowersRef.current.set(follower.handle, follower.did);
          addToTotalCount(follower.did);
        });

        cursor = followersRes.data?.cursor;
        if (!cursor || !followersRes.data?.followers.length) break;
      }
    }
  }

  async function addPostRepostsFollowers(post: Post | null) {
    if (!post) return;

    log("Fetching post reposts followers");
    for (const userDid of postRepostRef.current.values()) {
      let cursor: string | undefined;
      while (true) {
        const followersRes = await bskyRef.current.getAuthorFollowers(
          userDid,
          cursor
        );

        if (followersRes.error) {
          logError(followersRes.error);
          break;
        }

        followersRes.data?.followers.forEach((follower) => {
          repostsFollowersRef.current.set(follower.handle, follower.did);
          addToTotalCount(follower.did);
        });

        cursor = followersRes.data?.cursor;
        if (!cursor || !followersRes.data?.followers.length) break;
      }
    }
  }

  async function repeatForAuthor(formData: SearchInputFormData) {
    if (authorRef.current) {
      const postsRes = await bskyRef.current.getAuthorFeed(
        authorRef.current.did
      );

      if (!postsRes.data) {
        logError(postsRes.error);
      } else {
        let counter = 1;
        for (const feed of postsRes.data.feed) {
          log(`Repeating action... ${counter}/100`);

          if (formData.includeLikes) await addPostLikes(feed.post);
          if (formData.includeReposts) await addPostReposts(feed.post);
          if (formData.includeLikesFollowers)
            await addPostLikesFollowers(feed.post);
          if (formData.includeRepostFollowers)
            await addPostRepostsFollowers(feed.post);

          counter += 1;
        }
      }
    }
  }

  async function executeSimpleBlocks() {
    setLoading(true);
    const session = JSON.parse(
      sessionStorage.getItem("session")!
    ) as AuthenticationResponse;

    log(`Blocking...`);
    for (const did of totalCount.values()) {
      const blockRes = await bskyRef.current.blockUser(did, session);
      if (blockRes.data) {
        addToBlockCount(did);
      } else {
        logError(blockRes.error);
      }
    }


    setLoading(false);
  }

  async function executeCreationOfBlockList() {
    setLoading(true);
    log(`Blocking`);
    setLoading(false);
  }

  return (
    <div>
      <Navbar className="bg-body-tertiary mb-5" data-bs-theme="dark">
        <Container>
          <Navbar.Brand>Bluesky blockchain ⛓</Navbar.Brand>
          {isAuthenticated && (
            <Row>
              <Col>
                <LogoutButton
                  isAuthenticated={isAuthenticated}
                  setAuthenticated={setAuthenticated}
                />
              </Col>
            </Row>
          )}
        </Container>
      </Navbar>

      {!isAuthenticated && (
        <LoginForm
          authenticate={bskyRef.current.authenticate}
          setAuthenticated={setAuthenticated}
        />
      )}

      <SearchInput
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
        onSubmit={handleChainBlock}
      />
      <Counter
        isLoading={isLoading}
        totalCount={totalCount.size}
        blockCount={blockCount.size}
      />
      <LogsOutput logs={logs} />
    </div>
  );
}
