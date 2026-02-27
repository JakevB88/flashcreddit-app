/*this is a component that will cycle through the posts stored in the Store 
PostsSlice will load the data to the store.
*/

import {React, useEffect} from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
import { useDispatch, useSelector } from "react-redux";
import { commentsSlice, selectComments, fetchComments} from "./CommentsSlice";
import comment from "./Comments";

export default function Comments() {
  const comments = useSelector(selectComments); // Retreive the state for Comments from the store
  const dispatch = useDispatch();


  // Fetch once on first mount if there is no data
    useEffect(() => {
      if (Object.keys(comments).length === 0) {
        dispatch(fetchComments());
      }
    }, [dispatch, comments]);

    // Handle loading / empty state before .map()
    if (!comments) {
      return <div>Loading...</div>;
    }

  return (
    <section className="Comments">
      <h1>FlashcReddit</h1>
      <h2>Comments</h2>
      <ul className="Comments-list">
        {Object.values(comments).map((comment) => (
          <li key={comment.name} className="list">
            <Comments comment={comment}/>
          </li>
        ))}
      </ul>
    </section>
  );
}