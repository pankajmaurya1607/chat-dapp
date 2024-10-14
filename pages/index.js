import React, {useState, useEffect, useContext} from "react";

// Internal Imports
// import { ChatAppContext } from "../Context/ChatAppContext";
import { Filter, Friend  } from "../Components/index";

const index = () => {
  // const {  } = useContext(ChatAppContext);
  return <div>
    <Filter />
    <Friend />
  </div>;
};

export default index; 

