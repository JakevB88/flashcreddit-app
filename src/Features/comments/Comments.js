/*this is a component that will cycle through the comments stored in the Store 
CommentsSlice will load the data to the store.
*/

import {React, useEffect} from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { commentsSlice, selectComments, fetchComments} from "./CommentsSlice";
import { selectPostByName } from "../posts/PostsSlice";
import { selectCommentsForPermalink } from "./CommentsSlice";
import { selectCommentsStatusForPermalink } from "./CommentsSlice";
import Comment from "./Comment";
import Post from "../posts/Post";
import homeIcon from "./home.png"
import ROUTES from "../../app/routes";

export default function Comments() {
  const { name } = useParams();
  const post = useSelector(state => selectPostByName(state, name));
  const permalink = post?.permalink;

  const comments = useSelector((s) => selectCommentsForPermalink(s, permalink)) || [];
  const status = useSelector((s) => selectCommentsStatusForPermalink(s, permalink));
  const error = useSelector((s) => s.comments.byPermalink[permalink]?.error);

  let content = ""
  const dispatch = useDispatch();
  
  // Fetch once on first mount if there is no data
  
  useEffect(() => {
    if (!permalink) return;
    if (status === 'idle') {
      dispatch(fetchComments({ permalink }));
    }
  }, [dispatch, permalink, status]);



  //console.log(`comments: ${comments.name}`)
  //console.log(comments)
  //console.log(status)
  //console.log("in Comments.js")
  //console.log(post)

  //loading data
  if (status === "loading") {
    content = (
      <p className="infoMessage">Loading comments…</p>
  );

  }

  else if (status === "failed") {
    
    content = (
      <div className="errorMessage">
        <p>Sorry, we couldn’t load comments right now.</p>
        <p>{error}</p>
        <button onClick={() => dispatch(fetchComments({ permalink }))}>
          Retry
        </button>
      </div>
    );
  }

  else if (status === "succeeded" && comments.length === 0) {
    content = <p>No comments yet for this post!</p>;
  }

  else {
    content = (
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.name}>
            <Comment comment={comment} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="comments">
      
      <h1>FlashcReddit</h1>
      
      <div className="commentsHeader">
        <h2>Post</h2>
        <p></p>
        <Link to="/" className="homeIconLink">
          <img className="homeIcon" src={homeIcon} alt="home"/>
        </Link>
      </div>
      
      <Post post={post} showCommentsIcon={false}/>

      {content}

    </section>
  );
}