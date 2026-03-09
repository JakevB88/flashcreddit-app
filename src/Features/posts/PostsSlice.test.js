
import reducer, { fetchPosts } from "./PostsSlice";
import { configureStore } from "@reduxjs/toolkit";

// Mock the global fetch used inside fetchPosts
global.fetch = jest.fn();

describe("PostsSlice", () => {
    const sampleApiResponse = {
        data: {
        children: [
            { data: { name: "post1", title: "Hello World" } },
            { data: { name: "post2", title: "React Rocks" } },
        ],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --------------------------
    // INITIAL STATE
    // --------------------------
    it("initial state", () => {
        const state = reducer(undefined, { type: "@@INIT" });

        expect(state).toEqual({
        posts: {},
        status: "idle",
        error: null,
        });
    });

    // --------------------------
    // PENDING
    // --------------------------
    it("fetchPosts.pending sets status to loading", () => {
        const next = reducer(undefined, { type: fetchPosts.pending.type });

        expect(next.status).toBe("loading");
    });

    // --------------------------
    // FULFILLED
    // --------------------------
    it("fetchPosts.fulfilled stores posts by post.name", () => {
        const action = {
        type: fetchPosts.fulfilled.type,
        payload: sampleApiResponse.data.children.map((c) => c.data),
        };

        const next = reducer(undefined, action);

        expect(next.status).toBe("succeeded");
        expect(next.posts).toEqual({
        post1: { name: "post1", title: "Hello World" },
        post2: { name: "post2", title: "React Rocks" },
        });
    });

    // --------------------------
    // REJECTED
    // --------------------------
    it("fetchPosts.rejected sets status=failed and error message", () => {
        const action = {
        type: fetchPosts.rejected.type,
        error: { message: "Network Error" },
        };

        const next = reducer(undefined, action);

        expect(next.status).toBe("failed");
        expect(next.error).toBe("Network Error");
    });

    // --------------------------
    // FULL THUNK TEST
    // --------------------------
    it("dispatch(fetchPosts()) loads posts from mocked API", async () => {
        // Mock fetch() response JSON
        fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(sampleApiResponse),
        });

        // Create a real RTK test store
        const store = configureStore({
        reducer: { posts: reducer },
        });

        // Dispatch the async thunk
        await store.dispatch(fetchPosts());

        const state = store.getState().posts;

        expect(fetch).toHaveBeenCalledTimes(1);

        expect(state.status).toBe("succeeded");

        expect(state.posts).toEqual({
        post1: { name: "post1", title: "Hello World" },
        post2: { name: "post2", title: "React Rocks" },
        });
    });
});
