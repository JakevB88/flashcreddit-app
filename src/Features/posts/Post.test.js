import {
    unixToDate,
    normalisePost,
    GalleryComponent
} from "./Post.js";
import { render, screen } from "@testing-library/react";


it("converts UNIX timestamp to Date and time", ()=>{
    //arrange
    const inputObject = 1773088522

    const expectedValue = "09/03/2026, 20:35:22"
    
    //act
    const actualValue = unixToDate(inputObject, { locale: 'en-GB', timeZone: 'UTC', hour12: false })
    
    //assert
    expect(actualValue).toEqual(expectedValue);
})


it("renders an <img> for each item with the correct src and empty alt", () => {
    // arrange
    const data = {
    items: [
        { media_id: "abc123" },
        { media_id: "def456" },
        { media_id: "ghi789" },
    ],
    };

    // act
    render(<GalleryComponent data={data} />);

    // assert
    const images = screen.getAllByAltText('');
    expect(images).toHaveLength(3);

    expect(images[0]).toHaveAttribute("src", "https://i.redd.it/abc123.jpg");
    expect(images[1]).toHaveAttribute("src", "https://i.redd.it/def456.jpg");
    expect(images[2]).toHaveAttribute("src", "https://i.redd.it/ghi789.jpg");

    // alt should be empty string as per component
    images.forEach(img => expect(img).toHaveAttribute("alt", ""));
});



describe("normalisePost", () => {
    it("handles the Reddit listing child shape (raw.data) and spreads data", () => {
        const raw = {
        kind: "t3",
        data: {
            id: "abc123",
            title: "Hello Reddit",
            author: "alice",
            post_hint: "link",
            url: "https://example.com",
            is_video: false,
            selftext: "",
        },
        };

        const post = normalisePost(raw);

        // spread the data object (not the wrapper)
        expect(post.id).toBe("abc123");
        expect(post.title).toBe("Hello Reddit");
        // derived flags for this shape
        expect(post.isVideo).toBe(false);
        expect(post.isImage).toBe(false);
        expect(post.isGallery).toBe(false);
        expect(post.isText).toBe(false);
        expect(post.isLink).toBe(true);
        expect(post.videoUrl).toBeNull();
    });

    it("handles a direct post object with no wrapper", () => {
        const raw = {
        id: "xyz789",
        title: "Direct object",
        author: "bob",
        post_hint: "image",
        url: "https://i.redd.it/some-image.png",
        };

        const post = normalisePost(raw);
        expect(post.id).toBe("xyz789");
        expect(post.isImage).toBe(true);
        expect(post.isVideo).toBe(false);
        expect(post.isGallery).toBe(false);
        expect(post.isText).toBe(false);
        expect(post.isLink).toBe(false);
        expect(post.videoUrl).toBeNull();
    });

    
    it("sets isImage=true if URL ends with an image extension even without post_hint", () => {
        const raw = {
        id: "img001",
        url: "https://example.com/photo.JPEG",
        post_hint: undefined,
        };

        const post = normalisePost(raw);
        expect(post.isImage).toBe(true);
        expect(post.isVideo).toBe(false);
        expect(post.isGallery).toBe(false);
        expect(post.isLink).toBe(false);
    });


    it("sets isVideo=true only when is_video is true and reddit video fallback_url exists", () => {
        const withVideo = {
        id: "vid001",
        is_video: true,
        media: {
            reddit_video: {
            fallback_url: "https://v.redd.it/abc123/DASH_720.mp4",
            },
        },
        };
        const withoutFallback = {
        id: "vid002",
        is_video: true,
        media: { reddit_video: {} },
        };
        const isVideoFalse = {
        id: "vid003",
        is_video: false,
        media: {
            reddit_video: {
            fallback_url: "https://v.redd.it/xyz/DASH_720.mp4",
            },
        },
        };

        const p1 = normalisePost(withVideo);
        const p2 = normalisePost(withoutFallback);
        const p3 = normalisePost(isVideoFalse);

        expect(p1.isVideo).toBe(true);
        expect(p1.videoUrl).toBe("https://v.redd.it/abc123/DASH_720.mp4");

        expect(p2.isVideo).toBe(false);
        expect(p2.videoUrl).toBeNull();

        expect(p3.isVideo).toBe(false);
        expect(p3.videoUrl).toBe("https://v.redd.it/xyz/DASH_720.mp4"); // exposed but not considered a video without is_video
    });

    it("sets isGallery=true only when is_gallery is true and gallery_data exists", () => {
        const yes = {
        is_gallery: true,
        gallery_data: { items: [{ media_id: "abc" }] },
        };
        const noData = {
        is_gallery: true,
        };
        const notGallery = {
        is_gallery: false,
        gallery_data: { items: [] },
        };

        expect(normalisePost(yes).isGallery).toBe(true);
        expect(normalisePost(noData).isGallery).toBe(false);
        expect(normalisePost(notGallery).isGallery).toBe(false);
    });

    it("sets isText=true when selftext is a non-empty string", () => {
        const t1 = { selftext: "This is a body" };
        const t2 = { selftext: "" };
        const t3 = { selftext: null };
        const t4 = { selftext: undefined };

        expect(normalisePost(t1).isText).toBe(true);
        expect(normalisePost(t2).isText).toBe(false);
        expect(normalisePost(t3).isText).toBe(false);
        expect(normalisePost(t4).isText).toBe(false);
    });

    it("sets isLink=true when post_hint=link and not video/gallery/text", () => {
        const base = {
        post_hint: "link",
        url: "https://example.com",
        is_video: false,
        is_gallery: false,
        selftext: "",
        };
        // Plain link
        expect(normalisePost(base).isLink).toBe(true);

        // If it's also a video → isLink must be false
        const withVideo = {
        ...base,
        is_video: true,
        media: { reddit_video: { fallback_url: "https://v.redd.it/abc/DASH_720.mp4" } },
        };
        expect(normalisePost(withVideo).isLink).toBe(false);

        // If it's a gallery → isLink must be false
        const withGallery = {
        ...base,
        is_gallery: true,
        gallery_data: { items: [] },
        };
        expect(normalisePost(withGallery).isLink).toBe(false);

        // If it has selftext → isLink must be false
        const withText = { ...base, selftext: "some text" };
        expect(normalisePost(withText).isLink).toBe(false);
    });

    it("gracefully handles null/undefined raw and returns a minimal shape", () => {
        const p1 = normalisePost(undefined);
        const p2 = normalisePost(null);

        // Derived booleans should be falsey and videoUrl null
        expect(p1.isVideo).toBe(false);
        expect(p1.isImage).toBe(false);
        expect(p1.isGallery).toBe(false);
        expect(p1.isText).toBe(false);
        expect(p1.isLink).toBe(false);
        expect(p1.videoUrl).toBeNull();

        expect(p2.isVideo).toBe(false);
        expect(p2.isImage).toBe(false);
        expect(p2.isGallery).toBe(false);
        expect(p2.isText).toBe(false);
        expect(p2.isLink).toBe(false);
        expect(p2.videoUrl).toBeNull();
    });

    it("does not treat non-image URLs as images", () => {
        const raw = {
        url: "https://example.com/file.pdf",
        post_hint: undefined,
        };
        const post = normalisePost(raw);
        expect(post.isImage).toBe(false);
    });

    it("handles uppercase image extensions via case-insensitive regex", () => {
        const raw = {
        url: "https://cdn.example.com/cat.GIF",
        };
        const post = normalisePost(raw);
        expect(post.isImage).toBe(true);
    });

    it("does not explode when media is present but not a reddit_video", () => {
        const raw = {
        is_video: true,
        media: { oembed: { provider_name: "YouTube" } }, // no reddit_video
        };
        const post = normalisePost(raw);
        expect(post.isVideo).toBe(false);
        expect(post.videoUrl).toBeNull();
    });
    

})
