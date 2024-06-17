import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { selectorAdmin, selectorIsAuth } from "../redux/slices/auth";
import axios from "../axios";

export const CommentsBlock = ({
  items,
  children,
  isLoading = true,
  onCommentAdded,
}) => {
  const isAdmin = useSelector(selectorAdmin);
  const user = useSelector((state) => state.auth.data);
  const handleDelete = async (id) => {
    await axios.delete(`/comment/${id}`);
    onCommentAdded();
  };
  return (
    <SideBlock title="Комментарии">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem
              style={{ display: "flex", justifyContent: "space-between" }}
              alignItems="flex-start"
            >
              <div style={{ display: "flex" }}>
                <ListItemAvatar>
                  {isLoading ? (
                    <Skeleton variant="circular" width={40} height={40} />
                  ) : (
                    <Avatar
                      alt={obj.user.fullName}
                      src={obj.user.avatarURL || "/noavatar.png"}
                    />
                  )}
                </ListItemAvatar>
                {isLoading ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <Skeleton variant="text" height={25} width={120} />
                    <Skeleton variant="text" height={18} width={230} />
                  </div>
                ) : (
                  <div>
                    <ListItemText
                      primary={obj.user.fullName}
                      secondary={obj.text}
                    />
                  </div>
                )}
              </div>
              {user && (user._id === obj.user._id || user.role === "admin") && (
                <Button
                  onClick={() => handleDelete(obj._id)}
                  variant="contained"
                  color="error"
                >
                  Удалить
                </Button>
              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
