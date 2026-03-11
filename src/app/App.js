import React from "react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Posts from "../Features/posts/Posts.js";
import Post from "../Features/posts/Post.js";
import Comments from "../Features/comments/Comments.js";
import FadeWrapper from "../Features/fade.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FadeWrapper><Posts /></FadeWrapper>}/>
        <Route path="posts" element={<FadeWrapper><Posts/></FadeWrapper>}/>
        <Route path="/posts/:id" element={<FadeWrapper><Post/></FadeWrapper>} />
        <Route path="/comments/:name" element={<FadeWrapper><Comments/></FadeWrapper>}/>
      </Routes>
    </BrowserRouter>
  )
}