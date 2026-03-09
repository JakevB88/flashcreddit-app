import React from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
import { unixToDate } from "../posts/Post";

export default function comment({ comment }) {
    //console.log(comment)

    return ( 
        <article className="comment">
            <div className="commentHeader">
                <p className="author">Author: {comment.author}</p>
                <p className="score">⇧ {comment.score} ⇩</p>
                <p className="created">Created: {unixToDate(comment.created)}</p>
            </div>
            <div>
                <p className="commentBody"> {comment.body} </p>
            </div>
        </article>
    );
}

