import React from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";




export default function comment({ comment }) {
    console.log(comment)

    return ( 
        <article className="comment">
            <p className="created">Created: {comment.created}</p>
            <p className="author">Author: {comment.author}</p>
            <div>
                <p className="commentBody"> {comment.body} </p>
            </div>
        </article>
    );
}

