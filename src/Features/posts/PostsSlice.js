import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// import the posts via the Reddit Json API
export const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async () => {
        //const res = await fetch("https://corsproxy.io/?https://www.reddit.com/r/all.json");      
        const res = await fetch("https://www.reddit.com/r/all/.json?raw_json=1");

        const json = await res.json();
        return json.data.children.map(child => child.data);
    }
);



export const postsSlice = createSlice({
    name: 'posts',   //in the store this slice will be registered as "state.posts"
    initialState: { //set initial state for each post
        posts: {},
        status: "idle",
        error: null
    },

    /*the ruducers allow the state to be updated"
    */
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchPosts.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchPosts.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.posts = {};
            
            {/*move data retreived via the API from the payload into the stores state.posts object with the post.id as the key*/}
            action.payload.forEach((post) => {
            state.posts[post.name] = post;
            });
        })
        .addCase(fetchPosts.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    }

});


//selector
/*Selectors are convenience functions that read data from the Redux store.
to be used like: "const posts = useSelector(selectPosts);"
*/
export const selectPosts = (state) => state.posts.posts
export const selectPostsStatus = (state) => state.posts.status

export const selectPostByName = (state, name) =>
  state.posts.posts[name];

//Action export

//reducer
//export the reducer so it can be added to the store
export default postsSlice.reducer;
