/*this is a component that will cycle through the comments stored in the Store 
CommentsSlice will load the data to the store.
*/

import { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments} from "./CommentsSlice";
import { selectPostByName } from "../posts/PostsSlice";
import { selectCommentsForPermalink } from "./CommentsSlice";
import { selectCommentsStatusForPermalink } from "./CommentsSlice";
import Comment from "./Comment";
import Post from "../posts/Post";
import homeIcon from "./home.png"

export default function Comments() {
  const { name } = useParams();
  const post = useSelector(state => selectPostByName(state, name));
  const permalink = post?.permalink;

  const comments = useSelector((s) => selectCommentsForPermalink(s, permalink)) || [];
  const status = useSelector((s) => selectCommentsStatusForPermalink(s, permalink));
  const error = useSelector((s) => s.comments.byPermalink[permalink]?.error);


  let content = ""
  const dispatch = useDispatch();
  const [fadeOut, setFadeOut] = useState(false);
  const navigate = useNavigate();

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

  const goToPosts = () => {
    setFadeOut(true);

    //wait for the faid, then navigate
    setTimeout(() => {
        navigate("/");
    }, 350); // match your fade duration
  };

  return (
    <section className={`comments ${fadeOut ? "fade-out" : ""}`}>
      
      <h1>FlashcReddit</h1>
      
      <div className="commentsHeader">
        <h2>Post</h2>
        <p></p>
      <img className="homeIcon" src={homeIcon} alt="home" onClick={goToPosts}/>
      

      </div>
      
      <Post 
        post={post} 
        showCommentsIcon={false}
        onNavigateToComments={() => setFadeOut(true)}
      />

      {content}

    </section>
  );
}