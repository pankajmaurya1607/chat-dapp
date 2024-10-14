import React from "react";

// Internal Import
import Style from "./Error.module.css";

const Error = ({ error }) => {
  return (
    <div className={Style.Error}>
      <div className={Style.Error_box}>
        <h1>Please Fix This Error & Reload</h1>
        <p>{error}</p>
      </div>
    </div> 
  )
};

export default Error;
