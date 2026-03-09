/*this is a component that will cycle through the posts stored in the Store 
PostsSlice will load the data to the store.
*/

import {React, useEffect, useState, useMemo} from "react";
import { Link, useSearchParams } from "react-router-dom";
import ROUTES from "../../app/routes";
import { useDispatch, useSelector } from "react-redux";
import { postsSlice, selectPosts, fetchPosts } from "./PostsSlice";
import Post from "./Post";
import Search from "../search/Search";

export default function Posts() {
  const posts = useSelector(selectPosts); // Retreive the state for Posts
  const dispatch = useDispatch();

  //read q from the URL
  const [searchParams] =  useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') ?? '');

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


  // Handle loading / empty state before .map()
  if (!posts || Object.keys(posts).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <section className="posts">
      <h1>FlashcReddit</h1>
      <Search value={q} onChange={setQ}/>
      <ul className="posts-list">
        {visiblePosts.map((post) => (
          <li key={post.name} className="list">
            <Post post={post} showCommentsIcon={true} showHomeIcon={false}/>
          </li>
        ))}
      </ul>
    </section>
  );
}