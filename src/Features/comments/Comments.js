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
  console.log(post)


  return (
    <section className="comments">
      
      <h1>FlashcReddit</h1>
      
      <div className="commentsHeader">
        <h2 className="inline">Post</h2>
        <Link to="/" className="homeIconLink">
          <img className="homeIcon" src={homeIcon} alt="home"/>
        </Link>
      </div>
      
      <Post post={post} showCommentsIcon={false}/>
      <h2>*****Comments*****</h2>        
      <ul className="comments-list">
        {comments.map((comment) => (
          <li key={comment.name} className="list">
            <Comment comment={comment}/>
          </li>
        ))}
      </ul>
    </section>
  );
}