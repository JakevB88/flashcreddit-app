import React from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";




export default function comment({ comment }) {
    console.log(comment)
    console.log(post)
    return (
        <Link to={ROUTES.commentsRoute(post.name)} classname="comments-link">
            <article className="post">
                <h2>{np.title}</h2>

                <p className="author">Author: {np.author}</p>
                <p className="subreddit">Subreddit: {np.subreddit}</p>

                            
                {np.isText && <p>{np.selftext}</p>}

                {np.isImage && <img className="image" src={np.url} alt={np.title} />}

                {np.isVideo && (
                    <video className="video" controls>
                        <source
                            src={np.media.reddit_video.fallback_url}
                            type="video/mp4"
                        />
                    </video>
                )}

                {np.isGallery && <GalleryComponent data={np.gallery_data} />}

                
                {np.isLink && (
                    <p>
                        <a href={np.url} target="_blank" rel="noopener noreferrer">
                            {np.url}
                        </a>
                    </p>
                )}

                
            </article>
        </Link>
    );
}

