import React, { useState, useEffect } from "react";
import { Post } from "../components/Post";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ReactMarkdown from "react-markdown";
import { CommentsBlock, Index } from "../components";
import { useSelector } from "react-redux";
import { selectorIsAuth } from "../redux/slices/auth";

export const FullPost = () => {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const isAuth = useSelector(selectorIsAuth);
  const { id } = useParams();

  const fetchPost = async () => {
    try {
      const res = await axios.get(`/posts/${id}`);
      setData(res.data);
      setIsLoading(false);
    } catch (err) {
      alert("Ошибка при получении статьи");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentAdded = () => {
    fetchPost();
  };

  if (isLoading) {
    return <Post isLoading={isLoading} />;
  }

  return (
    <>
      <Post
        _id={data._id}
        title={data.name}
        imageUrl={data.animeURL}
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        tags={["Anime"]}
        isFullPost
      >
        <ReactMarkdown>{data.description}</ReactMarkdown>
      </Post>

      {data.comments && (
        <CommentsBlock
          onCommentAdded={handleCommentAdded}
          items={data.comments}
          isLoading={false}
        >
          {isAuth && (
            <Index postId={data._id} onCommentAdded={handleCommentAdded} />
          )}
        </CommentsBlock>
      )}
    </>
  );
};
