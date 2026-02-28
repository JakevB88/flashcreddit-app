/*this is a component that will cycle through the comments stored in the Store 
CommentsSlice will load the data to the store.
*/

import {React, useEffect} from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { commentsSlice, selectComments, fetchComments} from "./CommentsSlice";
import { selectPostByName } from "../posts/PostsSlice";
import Comment from "./Comments";
import Post from "../posts/Post";
import homeIcon from "./home.png"
import ROUTES from "../../app/routes";

export default function Comments() {
  const { name } = useParams();
  console.log("Post name from URL:", name);

  const post = useSelector(state => selectPostByName(state, name));
  console.log(post)

  const comments = useSelector(selectComments)
  const dispatch = useDispatch();
  
  // Fetch once on first mount if there is no data
  useEffect(() => {
    if (!comments || comments.length === 0) {
      console.log("Dispatching fetchComments()");
      // placeholder until real permalink is wired in:
      dispatch(fetchComments({ permalink: ""}));
    }
  }, [dispatch, comments]);


  


  return (
    <section className="comments">
      
      <h1>FlashcReddit</h1>
      
      <div className="commentsHeader">
        <h2 className="inline">Comments</h2>
        <Link to="/" className="homeIconLink">
          <img className="homeIcon" src={homeIcon} alt="home"/>
        </Link>
      </div>
      
      <Post post={post} showCommentsIcone={false}/>
              
      {/*<ul className="comments-list">
        {Object.values(comments).map((comment) => (
          <li key={comment.name} className="list">
            <Comment comment={comment}/>
          </li>
        ))}
      </ul>*/}
    </section>
  );
}