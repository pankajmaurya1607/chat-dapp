import React, { useState, useEffect, useContext } from "react";
// Internal Imports
import { UserCard } from "../Components";
import Style from "../Styles/alluser.module.css";
import { ChatAppContext } from "../Context/ChatAppContext";

const alluser = () => {
  const { userLists, addFriends } = useContext(ChatAppContext);
  console.log(userLists);
  return (
    <div>
      <div className={Style.alluser_info}>
        <h1>Find Your Friend</h1>
      </div>
      <div className={Style.alluser}>
        {userLists.map((el, i) => (
          <UserCard key={i + 1} el={el} i={i} addFriends={addFriends} />
        ))}
      </div>
    </div>
  );
};

export default alluser;
