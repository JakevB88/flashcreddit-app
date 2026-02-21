import React from "react";
import {Route, BrowserRouter, Routes} from "react-router-dom";
import Posts from "../Features/posts/Posts.js";
import AppLayout from "./AppLayout.js";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout/>}>
          <Route path="posts" element={<Posts/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}