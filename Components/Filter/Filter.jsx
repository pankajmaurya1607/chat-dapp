import React, { useState, useContext } from "react";
import Image from "next/image";


// Internal Imports
import Style from "./Filter.module.css";
import images from "../../assets";
import { ChatAppContext } from "../../Context/ChatAppContext";
import { Model } from "../index"


const Filter = () => {
  const { account, addFriends } = useContext(ChatAppContext);

  const [addFriend, setAddFriend] = useState(false);

  // const handleFilter = (e) => {
  //   const searchTerm = e.target.value.toLowerCase();
  //   const filtered = projects.filter((project) =>
  //     project.name.toLowerCase().includes(searchTerm)
  //   );
  //   setFilteredProjects(filtered);
  // };

  return (
    <div className={Style.Filter}>
      <div className={Style.Filter_box}>
        <div className={Style.Filter_box_left}>
          <div className={Style.Filter_box_left_search}>
            <Image src={images.search} alt="image" width={20} height={20} />
            <input type="text" placeholder="Search.." />
          </div>
        </div>
        <div className={Style.Filter_box_right}>
          <button onClick={() => setAddFriend(true)}>
            <Image src={images.user} alt="clear" width={20} height={20} />
            ADD FRIEND
          </button>
        </div>
      </div>
      {/* Model Component */}
      {addFriend && (
        <div className={Style.Filter_model}>
          <Model
            openBox={setAddFriend}
            title="Welcome to"
            head="CHAT BUDDY"
            info="Lorem ipsum dolor sit amet consectetur, adipisicing elit. Expedita, aut voluptate. Commodi quasi hic non, exercitationem saepe beatae obcaecati aliquid dolorum accusamus consequatur quas, quo eos iste molestias sapiente quidem."
            smallInfo="Kindly Select Your Friend Name & Address..."
            image={images.hero}
            functionName={addFriends}
          />
        </div>
      )}
    </div>
  );
};

export default Filter;