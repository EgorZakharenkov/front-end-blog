import React, { useState } from "react";
import styles from "./AddComment.module.scss";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import axios from "../../axios";

export const Index = ({ postId, onCommentAdded }) => {
  const user = useSelector((state) => state.auth.data);
  const [text, setText] = useState("");

  const handleComment = async () => {
    try {
      await axios.post("/comment", {
        text,
        postId,
        user: user._id,
      });
      onCommentAdded(); // Запрашиваем полный пост заново
      setText("");
    } catch (error) {
      console.error("Ошибка при добавлении комментария", error);
    }
  };

  return (
    <div className={styles.root}>
      <Avatar
        classes={{ root: styles.avatar }}
        src={user?.avatarURL || "noavatar.png"}
      />
      <div className={styles.form}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Написать комментарий"
          variant="outlined"
          maxRows={10}
          multiline
          fullWidth
        />
        <Button onClick={handleComment} variant="contained">
          Отправить
        </Button>
      </div>
    </div>
  );
};
