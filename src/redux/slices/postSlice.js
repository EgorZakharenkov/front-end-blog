import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
export const FetchPost = createAsyncThunk("posts/fetchPosts", async () => {
  const data = await axios.get("/posts");
  return data;
});

export const FetchRemovePost = createAsyncThunk(
  "posts/FetchRemovePost",
  async (_id) => {
    await axios.delete(`/posts/${_id}`);
  }
);

const initialState = {
  posts: {
    items: [],
    items_sort: [],
    items_look: [],
    items_search: [],
    status: "loading",
    item: {},
  },
  leng: null,
};

const PostSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    sorPosts: (state) => {
      state.posts.items = state.posts.items_look;
      state.posts.items.data = state.posts.items.data.sort((a, b) =>
        a.viewsCount > b.viewsCount ? -1 : 1
      );
    },
    setItem: (state, action) => {
      state.posts.item = action.payload;
    },
    addComment: (state, action) => {
      state.posts.item = state.posts.item.comments.push(action.payload);
    },
    searchPost: (state, action) => {
      state.posts.items.data = state.posts.items_look.data.filter((name) => {
        return name.name.toLowerCase().includes(action.payload.toLowerCase());
      });
    },
    defaul_sort: (state) => {
      state.posts.items_search = [];
      state.posts.items = state.posts.items_sort;
    },
    chekedLook: (state) => {
      state.posts.items.data = [];
      for (let i = 0; i < state.posts.items_look.data.length; i++)
        if (state.posts.items_look.data[i].look === true) {
          state.posts.items.data.push(state.posts.items_look.data[i]);
        }
    },
  },
  extraReducers: {
    [FetchPost.pending]: (state) => {
      state.posts.status = "loading";
    },
    [FetchPost.fulfilled]: (state, action) => {
      state.posts.status = "loaded";
      state.posts.items = action.payload;
      state.posts.items_sort = action.payload;
      state.posts.items_look = action.payload;
      state.leng = action.payload.data.length;
    },
    [FetchPost.rejected]: (state) => {
      state.posts.status = "error";
      state.posts.items = [];
      state.posts.items_sort = [];
      state.posts.items_look = [];
    },
    [FetchRemovePost.pending]: (state, action) => {
      state.posts.items.data = state.posts.items.data.filter(
        (item) => item._id !== action.meta.arg
      );
      state.posts.items_look.data = state.posts.items.data.filter(
        (item) => item._id !== action.meta.arg
      );
      state.posts.items_sort.data = state.posts.items.data.filter(
        (item) => item._id !== action.meta.arg
      );
    },
  },
});
export const postReducer = PostSlice.reducer;
export const {
  sorPosts,
  addComment,
  defaul_sort,
  chekedLook,
  searchPost,
  setItem,
  Len,
} = PostSlice.actions;
