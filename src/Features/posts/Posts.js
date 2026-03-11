/*this is a component that will cycle through the posts stored in the Store 
PostsSlice will load the data to the store.
*/

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectPostsStatus, selectPosts, fetchPosts } from "./PostsSlice";
import Post from "./Post";
import Search from "../search/Search";

export default function Posts() {
  const posts = useSelector(selectPosts); // Retreive the state for Posts
  const status = useSelector(selectPostsStatus);
  const dispatch = useDispatch();

  //read q from the URL
  const [searchParams] =  useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');

  const [fadeOut, setFadeOut] = useState(false);
  // Fetch once on first mount if there is no data
  useEffect(() => {
    if (!posts || Object.keys(posts).length === 0) {
      dispatch(fetchPosts());
    }
  }, [dispatch, posts]);

  
  // Derive a filtered list (case-insensitive)
  const visiblePosts = useMemo(() => {
    const all = Object.values(posts ?? {});
    const term = q.trim().toLowerCase();
    if (!term) return all;
    return all.filter((post) =>
      [post.title, post.author, post.body, post.summary, post.selftext]
        .filter(Boolean)
        .some((s) => s.toLowerCase().includes(term))
    );
  }, [posts, q]);

  //loading data
  if (status === "loading") {
    return <div className="postsStatus">Loading…</div>;
  }

  //failed to retreive data
  if (status === "failed") {
    return (
      <div className="postsStatus">
        Sorry, we couldn’t load posts right now.
        {status.error ? <div className="error-detail">{String(status.error)}</div> : null}
      </div>
    );
  }

  // No data at all
  if (!posts || Object.keys(posts).length === 0) {
    return (
      <section className="postsStatus">
        <h1>FlashcReddit</h1>
        <Search value={q} onChange={setQ} />
        <div className="empty">No posts available.</div>
      </section>
    );
  }

  return (
    <section className={`posts ${fadeOut ? "fade-out" : ""}`}>
      <h1>FlashcReddit</h1>
      <Search value={q} onChange={setQ}/>
      <ul className="posts-list">
        {visiblePosts.map((post) => (
          <li key={post.name} className="list">
            <Post 
              post={post} 
              showCommentsIcon={true} 
              showHomeIcon={false} 
              onNavigateToComments={() => setFadeOut(true)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}