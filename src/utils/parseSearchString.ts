export function parseSearchString(url: string): {
  author: string;
  postId: string;
} {
  const items = url.split("/");

  return {
    author: items[4],
    postId: items[6],
  };
}
