import React from "react";
import {Route, HashRouterRouter, Routes} from "react-router-dom";
import Posts from "../Features/posts/Posts.js";
import Post from "../Features/posts/Post.js";
import Comments from "../Features/comments/Comments.js";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Posts />}/>
        <Route path="posts" element={<Posts/>}/>
        <Route path="/posts/:id" element={<Post/>} />
        <Route path="/comments/:name" element={<Comments/>}/>
      </Routes>
    </HashRouter>
  )
}