/*this is a component that will cycle through the posts stored in the Store 
PostsSlice will load the data to the store.
*/

import {React, useEffect} from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
import { useDispatch, useSelector } from "react-redux";
import { postsSlice, selectPosts, fetchPosts } from "./PostsSlice";
import Post from "./Post";

export default function Posts() {
  const posts = useSelector(selectPosts); // Retreive the state for Posts
  const dispatch = useDispatch();


  // Fetch once on first mount if there is no data
    useEffect(() => {
      if (Object.keys(posts).length === 0) {
        dispatch(fetchPosts());
      }
    }, [dispatch, posts]);

    // Handle loading / empty state before .map()
    if (!posts) {
      return <div>Loading...</div>;
    }

  return (
    <section className="posts">
      <h1>FlashcReddit</h1>
      <ul className="posts-list">
        {Object.values(posts).map((post) => (
          <li key={post.name} className="list">
            <Post post={post} showCommentsIcon={true} showHomeIcon={false}/>
          </li>
        ))}
      </ul>
    </section>
  );
}