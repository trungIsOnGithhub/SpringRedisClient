
import React, { useMemo } from "react";
import { getAvatarByUserAndRoomId } from "../../../../../utils";
import ChatIcon from "./ChatIcon";

const AvatarImage = ({ name, id }) => {
  const url = useMemo(() => {
    const av = getAvatarByUserAndRoomId("" + id);
    if (name === "User1") {
      return `${process.env.PUBLIC_URL}/avatars/0.jpg`;
    } else if (name === "User2") {
      return `${process.env.PUBLIC_URL}/avatars/2.jpg`;
    } else if (name === "User3") {
      return `${process.env.PUBLIC_URL}/avatars/9.jpg`;
    } else if (name === "User4") {
      return `${process.env.PUBLIC_URL}/avatars/8.jpg`;
    }
    return av;
  }, [id, name]);

  return (
    <>
      {name !== "General" ? (
        <img
          src={url}
          alt={name}
          style={{ width: 32, height: 32, objectFit: "cover" }}
          className="rounded-circle avatar-xs"
        />
      ) : (
        <div className="overflow-hidden rounded-circle">
          <ChatIcon />
        </div>
      )}
    </>
  );
};

export default AvatarImage;
