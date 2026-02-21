/*this is a component that will cycle through the posts stored in the Store 
PostsSlice will load the data to the store.
*/

import {React, useEffect} from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts } from "./PostsSlice";
import { fetchPosts } from "./PostsSlice";

export default function Posts() {
  const posts = useSelector(selectPosts); // Retreive the state for quizzes
  const dispatch = useDispatch();

  //Dispatch
  //useaffect only runs when the page is loaded
  useEffect(() => {
    dispatch(fetchPosts())
  }, [dispatch]);
  
  


  return (
    <section className="center">
      <h1>Posts</h1>
      <ul className="posts-list">
        {console.log(`posts`)}
        {Object.values(posts).map((post) => (
          <li key={post.name} className="post">
            <Link to={ROUTES.postRoute(post.name)}>
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}