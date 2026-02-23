import React from "react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Posts from "../Features/posts/Posts.js";
import Post from "../Features/posts/Post.js";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Posts />}/>
        <Route path="posts" element={<Posts/>}/>
        <Route path="/posts/:id" element={<Post/>} />
      </Routes>
    </BrowserRouter>
  )
}