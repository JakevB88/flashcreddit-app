import React from "react";


export function normalisePost(raw) {
    const isVideo =
        raw.is_video && raw.media?.reddit_video?.fallback_url;

    const isImage =
        raw.post_hint === "image" ||
        (raw.url && raw.url.match(/\.(jpg|jpeg|png|gif)$/i));

    const isGallery =
        raw.is_gallery && raw.gallery_data;

    const isText =
        raw.selftext && raw.selftext.length > 0;
    
    
    const isLink =
        raw.post_hint === "link" &&
        !raw.is_video &&
        !raw.is_gallery &&
        !raw.selftext;

    return {
        ...raw,
        isVideo,
        isImage,
        isGallery,
        isText,
        isLink
    };
}


function GalleryComponent({ data }) {
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



export default function Post({ post }) {
    const np = normalisePost(post)
    //console.log(post.subreddit)
    console.log(post)
    return (
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
    );
}

