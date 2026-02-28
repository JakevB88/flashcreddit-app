import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../Features/posts/PostsSlice' //import the defualt export from postsSlice.js
import commentsReducer from '../Features/comments/CommentsSlice'


export default configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer
  },
});
