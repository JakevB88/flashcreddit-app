
// src/Features/posts/Posts.test.js
import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

/* ──────────────────────────────────────────────────────────────────────────────
   Optional: silence React Router v7 future warnings in test output
   ────────────────────────────────────────────────────────────────────────────── */
const originalWarn = console.warn;
beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation((msg, ...args) => {
        if (String(msg).includes("React Router Future Flag Warning")) return;
        originalWarn(msg, ...args);
    });
});
afterAll(() => {
    console.warn.mockRestore();
});

/* ──────────────────────────────────────────────────────────────────────────────
   Mock PostsSlice: return a *plain object* action so dispatch() is valid
   IMPORTANT: define jest.fn INSIDE the factory (Jest hoisting rule)
   ────────────────────────────────────────────────────────────────────────────── */
jest.mock("./PostsSlice", () => {
    const fetchPosts = jest.fn(() => ({ type: "posts/fetch" })); // ← plain POJO action
    return {
        __esModule: true,
        selectPosts: (state) => state.posts,
        fetchPosts,
        postsSlice: {},
    };
});

/* ──────────────────────────────────────────────────────────────────────────────
   Mock child components to keep these tests focused on Posts behavior
   ────────────────────────────────────────────────────────────────────────────── */
jest.mock("./Post", () => (props) => {
    const { post } = props;
    return (
        <div data-testid="post">
        <span data-testid="post-title">{post.title}</span>
        </div>
    );
});

jest.mock("../search/Search", () => ({ value, onChange }) => {
    return (
        <input
        aria-label="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        />
    );
});

/* ──────────────────────────────────────────────────────────────────────────────
   Helper: render with a minimal Redux store + MemoryRouter
   Identity reducer so useSelector sees preloadedState
   ────────────────────────────────────────────────────────────────────────────── */
function renderWithProviders(ui, { preloadedState, route = "/" } = {}) {
    const store = configureStore({
        reducer: (state = preloadedState) => state,
        preloadedState,
    });

    const view = render(
        <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </Provider>
    );

    return { store, ...view };
    }

/* ──────────────────────────────────────────────────────────────────────────────
   Test data: posts object map (component expects .name for <li key>)
   ────────────────────────────────────────────────────────────────────────────── */
const POSTS_FIXTURE = {
    a1: { name: "t3_a1", title: "React Patterns", author: "Bob", summary: "Hooks and effects" },
    b2: { name: "t3_b2", title: "Node Tips", author: "Carol", selftext: "Streams and buffers" },
    c3: { name: "t3_c3", title: "Hello World", author: "Alice", body: "First post body" },
};

/* ──────────────────────────────────────────────────────────────────────────────
   Import after mocks so component sees the mocked modules
   ────────────────────────────────────────────────────────────────────────────── */
import Posts from "./Posts";
import { fetchPosts as fetchPostsMock } from "./PostsSlice";

describe("<Posts />", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    it("renders posts and filters using the 'q' param from the URL (case-insensitive)", () => {
        const preloadedState = { posts: POSTS_FIXTURE };

        // Start at /?q=react
        renderWithProviders(<Posts />, { preloadedState, route: "/?q=react" });

        // Only the React post should remain
        const items = screen.getAllByTestId("post");
        expect(items).toHaveLength(1);
        expect(within(items[0]).getByTestId("post-title")).toHaveTextContent("React Patterns");
    });

    it("filters interactively when typing into the Search input", async () => {
        const preloadedState = { posts: POSTS_FIXTURE };
        renderWithProviders(<Posts />, { preloadedState, route: "/" });

        // user-event v13/v14 compatibility
        const user = userEvent.setup ? userEvent.setup() : userEvent;

        // Initially all posts visible
        expect(screen.getAllByTestId("post")).toHaveLength(3);

        const input = screen.getByLabelText(/search/i);

        // 'node' → only Node Tips
        await user.clear(input);
        await user.type(input, "node");
        expect(screen.getAllByTestId("post")).toHaveLength(1);
        expect(screen.getByTestId("post-title")).toHaveTextContent("Node Tips");

        // '  WORLD  ' → trims & ignores case → Hello World
        await user.clear(input);
        await user.type(input, "  WORLD  ");
        expect(screen.getAllByTestId("post")).toHaveLength(1);
        expect(screen.getByTestId("post-title")).toHaveTextContent("Hello World");
    });
});
