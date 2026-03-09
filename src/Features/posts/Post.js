import React from "react";
import { Link } from "react-router-dom";
import ROUTES from "../../app/routes";
import commentIcon from "./comment.png";





export function normalisePost(raw) {
    // Handle both listing child shape and direct post data
    const d = raw?.data ?? raw ?? {};

    // Pre-calc optional values
    const videoUrl = d.media?.reddit_video?.fallback_url ?? null;

    const isVideo = Boolean(d.is_video && videoUrl);

    const isImage =
        d.post_hint === 'image' ||
        (typeof d.url === 'string' && /\.(jpg|jpeg|png|gif)$/i.test(d.url));

    const isGallery = Boolean(d.is_gallery && d.gallery_data);

    const isText = Boolean(d.selftext && d.selftext.length > 0);

    const isLink =
        d.post_hint === 'link' &&
        !d.is_video &&
        !d.is_gallery &&
        !d.selftext;

    return {
        ...d,             // spread the *data* object, not the wrapper
        isVideo,
        isImage,
        isGallery,
        isText,
        isLink,
        videoUrl,         // expose for safe use in render
    };
}


export function GalleryComponent({ data }) {
    return (
        <div>
            {data.items.map(item => (
                <img className="image"
                    key={item.media_id}
                    src={`https://i.redd.it/${item.media_id}.jpg`}
                    alt=""
                />
            ))}
        </div>
)}

export function unixToDate(unix,{
    locale = 'en-GB',
    timeZone = 'UTC',
    hour12 = false
}= {}) {
    const date = new Date(unix*1000);
    return date.toLocaleString(
        locale, {
            timeZone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12
        }
);
}



export default function Post({ post, showCommentsIcon }) {
    const np = normalisePost(post)
    //console.log(post.subreddit)
    console.log(post)
    return (
    
        <article className="post">
            
            <h2>{np.title}</h2>
                
                   
            <div className="postHeader">
                <p className="author">Author: {np.author}</p>
                <p className="score">⇧ {np.score} ⇩</p>
                <p className="subreddit">Subreddit: {np.subreddit}</p>
            </div>

            {np.isText && <p className="postText">{np.selftext}</p>}

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

            <div className="postFooter">
                {showCommentsIcon && (
                <Link to={ROUTES.commentsRoute(post.name)} className="commentIconLink">
                        <img className="commentIcon" src={commentIcon} alt="comments"/>
                </Link>
                )}
                <p className="created">Created: {unixToDate(np.created)}</p>
            </div>
            
        </article>
        
    );
}

