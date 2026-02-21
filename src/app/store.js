import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../Features/posts/PostsSlice' //import the defualt export from postsSlice.js



export default configureStore({
  reducer: {
    posts: postsReducer
  },
});
