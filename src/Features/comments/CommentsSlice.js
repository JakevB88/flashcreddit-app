import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// import the posts via the Reddit Json API
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ permalink }) => {

    const url = `https://www.reddit.com${permalink.replace(/\/$/, "")}.json?raw_json=1`;

    const res = await fetch(url);
    const json = await res.json();

    // Reddit returns [postListing, commentsListing]
    const commentsListing = json[1].data.children;

    // Extract only comment items
    const comments = commentsListing
      .filter(c => c.kind === "t1")
      .map(c => c.data);

    return comments; 
  }
);




export const commentsSlice = createSlice({
    
    name: 'comments',   //in the store this slice will be registered as "state.posts"
    initialState: { //set initial state for each post
        comments: {},
        status: "idle",
        error: null
    },

    /*the ruducers allow the state to be updated"
    */
    reducers: {},
    
    extraReducers: (builder) => {
        builder
        .addCase(fetchComments.pending, (state) => {
            state.status = "loading";
        })
        .addCase(fetchComments.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.comments = action.payload;
            
            {/*move data retreived via the API from the payload into the stores state.posts object with the post.id as the key
            action.payload.forEach((post) => {
            state.comments[post.name] = post;
            });*/}
        })
        .addCase(fetchComments.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message;
        });
    }

});


//selector
/*Selectors are convenience functions that read data from the Redux store.
to be used like: "const posts = useSelector(selectPosts);"
*/
export const selectComments = (state) => state.comments.comments

//Action export

//reducer
//export the reducer so it can be added to the store
export default commentsSlice.reducer;
