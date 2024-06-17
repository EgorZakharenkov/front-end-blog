import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import { Post } from "../components/Post";
import {
  chekedLook,
  defaul_sort,
  FetchPost,
  searchPost,
  sorPosts,
} from "../redux/slices/postSlice";
import { useDispatch, useSelector } from "react-redux";
import "./home.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { selectorAdmin, selectorIsAuth } from "../redux/slices/auth";
export const Home = () => {
  const { posts } = useSelector((state) => state.posts);

  const isPostLoading = posts.status === "loading";
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.data);
  const [New, setNew] = useState(0);
  const [POST, SetPOST] = useState([]);
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [colvo, setColvp] = useState(false);

  console.log(userData);

  const tabClick = () => {
    setNew(1);
    dispatch(sorPosts());
    console.log(POST);
  };
  const tabClick_2 = () => {
    dispatch(defaul_sort());
    setNew(0);
  };
  const tabClick_4 = () => {
    setNew(3);
    setIsSearch(!isSearch);
  };
  const searchCLick = (e) => {
    e.preventDefault();
    dispatch(searchPost(search));
    setSearch("");
  };
  React.useEffect(() => {
    dispatch(FetchPost());
    SetPOST(posts);
  }, []);
  const isAdmin = useSelector(selectorAdmin);
  console.log(posts.items.data);
  return (
    <>
      <div className="head_wrapp">
        <Tabs
          style={{ marginBottom: 15 }}
          value={New}
          aria-label="basic tabs example"
        >
          <Tab onClick={tabClick_2} label="Новые" />
          <Tab onClick={tabClick} label="Популярные" />
          <Tab onClick={tabClick_4} label="Поиск" />
        </Tabs>
        {isSearch ? (
          <div className="search_form">
            <form onSubmit={searchCLick}>
              <TextField
                onChange={(event) => setSearch(event.target.value)}
                value={search}
                id="outlined-basic"
                label="Поиск"
                variant="outlined"
              />
            </form>
            <Button onClick={searchCLick} variant="contained">
              Найти
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <Grid spacing={2}>
        <Grid gap={5} flexWrap={"wrap"} display={"flex"} item>
          {(isPostLoading ? [...Array(3)] : posts.items.data).map(
            (obj, index) =>
              isPostLoading ? (
                <Post isLoading={true} key={index} />
              ) : (
                <Post
                  key={index}
                  _id={obj._id}
                  title={obj.name}
                  imageUrl={obj.animeURL}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  tags={["Беларусь"]}
                  isEditable={isAdmin}
                />
              )
          )}
        </Grid>
        {/*<Grid xs={4} item>*/}
        {/*  <TagsBlock items={['react', 'typescript', 'заметки']} isLoading={false} />*/}
        {/*  <CommentsBlock*/}
        {/*    items={[*/}
        {/*      {*/}
        {/*        user: {*/}
        {/*          fullName: 'Вася Пупкин',*/}
        {/*          avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',*/}
        {/*        },*/}
        {/*        text: 'Это тестовый комментарий',*/}
        {/*      },*/}
        {/*      {*/}
        {/*        user: {*/}
        {/*          fullName: 'Иван Иванов',*/}
        {/*          avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',*/}
        {/*        },*/}
        {/*        text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*    isLoading={false}*/}
        {/*  />*/}
        {/*</Grid>*/}
      </Grid>
    </>
  );
};
