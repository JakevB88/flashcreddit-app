import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


// import the posts via the Reddit Json API
export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async ({ permalink }) => {
    const safePermalink = permalink.startsWith('/') ? permalink : `/${permalink}`;
    //const url = `https://old.reddit.com${permalink.replace(/\/$/, "")}.json?raw_json=1`;
    const url = `https://www.reddit.com${permalink.replace(/\/$/, "")}.json?raw_json=1`;
    console.log(url)
    const res = await fetch(url);
    const json = await res.json();

    // Reddit returns [postListing, commentsListing]
    const commentsListing = json[1].data.children;

    // Extract only comment items
    const comments = commentsListing
      .filter(c => c.kind === "t1")
      .map(c => c.data)
      .filter(c => c.author !== 'AutoModerator');
    return  {permalink: safePermalink, comments }; 
  }
);






const initialThread = () => ({ items: [], status: 'idle', error: null });

export const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    byPermalink: {} // { [permalink]: { items, status, error } }
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        const permalink = action.meta.arg.permalink.startsWith('/')
          ? action.meta.arg.permalink
          : `/${action.meta.arg.permalink}`;
        state.byPermalink[permalink] = state.byPermalink[permalink] || initialThread();
        state.byPermalink[permalink].status = 'loading';
        state.byPermalink[permalink].error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { permalink, comments } = action.payload;
        state.byPermalink[permalink] = state.byPermalink[permalink] || initialThread();
        state.byPermalink[permalink].status = 'succeeded';
        state.byPermalink[permalink].items = comments;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const permalink = action.meta.arg.permalink.startsWith('/')
          ? action.meta.arg.permalink
          : `/${action.meta.arg.permalink}`;
        state.byPermalink[permalink] = state.byPermalink[permalink] || initialThread();
        state.byPermalink[permalink].status = 'failed';
        state.byPermalink[permalink].error = action.error.message;
      });
  }
});

export const selectCommentsForPermalink = (state, permalink) => {
  const safe = permalink?.startsWith('/') ? permalink : `/${permalink ?? ''}`;
  return state.comments.byPermalink[safe]?.items;
};

export const selectCommentsStatusForPermalink = (state, permalink) => {
  const safe = permalink?.startsWith('/') ? permalink : `/${permalink ?? ''}`;
  return state.comments.byPermalink[safe]?.status ?? 'idle';
};

export default commentsSlice.reducer;

