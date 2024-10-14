import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

// Internal Imports
import {
  checkIfWalletIsConnected,
  connectWallet,
  connectingWithContract,
} from "../Utils/apiFeature";

export const ChatAppContext = React.createContext();

export const ChatAppProvider = ({ children }) => {
  // USE STATE
  const [account, setAccount] = useState("");
  const [userName, setUserName] = useState("");
  const [friendLists, setFriendLists] = useState([]);
  const [friendMsg, setFriendMsg] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLists, setUserLists] = useState([]);
  const [error, setError] = useState("");

  // CHAT USER DATA
  const [currentUserName, setCurrentUserName] = useState("");
  const [currentUserAddress, setCurrentUserAddress] = useState("");

  const router = useRouter();

  // FETCHING USER DATA AT INITIAL LOAD
  const fetchData = async () => {
    try {
      const address = await checkIfWalletIsConnected();
      
      // debuugging
      console.log(address);
      
      if (address) {
        // GET CONTRACT
        const contract = await connectingWithContract();

        // debugging
        console.log(contract);
        

        // GET ACCOUNT
        const connectAccount = await connectWallet();
        setAccount(connectAccount);

        // debugging
        console.log(connectAccount);

        // console.log(connectAccount);

        // GET USER DATA
        // Check if user exists before calling getUserName
        const userExists = await contract.checkUserExists(connectAccount);
        if (userExists) {
          const userName = await contract.getUserName(connectAccount);

          // debugging
          console.log(userName);

          setUserName(userName);
        } else {
          console.log("User does not exist");
          setUserName("");
        }

        // GET FRIEND LIST
        const friendList = await contract.getMyFriendsList(connectAccount);

        // debugging
        console.log(friendList);

        setFriendLists(friendList);

        // GET ALL APP USER LIST
        const userList = await contract.getAllAppUser();

        // debugging
        console.log("51111111111111111111111111");
        console.log(userList);

        const newArray = userList.filter(
          (user) => user.accountAddress.toLowerCase() !== address
        );

        const filterArray = filterUsersExcludingFriends(newArray, friendList); 
        
        console.log(filterArray);

        setUserLists(filterArray);
      }
    } catch (error) {
      // setError("Please Connect Wallet");
      // console.error(error);
    }
  };

  function filterUsersExcludingFriends(newArray, friendLists) {
    const friendAddress = new Set(friendLists.map((friend) => friend.pubkey));
    return newArray.filter((user) => !friendAddress.has(user.accountAddress));
  }

  useEffect(() => {
    fetchData();
  }, []);

  // READ MESSAGE FROM FRIEND
  const readMessage = async (friendAddress) => {
    try {
      const contract = await connectingWithContract();
      const read = await contract.readMessage(friendAddress);
      setFriendMsg(read);
    } catch (error) {
      setError("Currently No Message");
      console.error(error);
    }
  };

  // CREATE ACCOUNT
  const createAccount = async ({ name }) => {
    try {
      if (!name) {
        setError("Please Fill Name Field");
        return;
      }

      const contract = await connectingWithContract();
      const getCreatedUser = await contract.createAccount(name);
      setLoading(true);
      await getCreatedUser.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Error Creating Account");
      console.error(error);
    }
  };

  // ADD FRIEND
  const addFriends = async ({ name, accountAddress }) => {
    try {
      if (!name || !accountAddress) {
        setError("Please Fill All Fields");
        return;
      }

      const contract = await connectingWithContract();
      const addMyFriend = await contract.addFriend(accountAddress, name);
      setLoading(true);
      await addMyFriend.wait();
      setLoading(false);
      router.push("/");
      window.location.reload();
    } catch (error) {
      setError("Error Adding Friend, try again");
      console.error(error);
    }
  };

  // SEND MESSAGE
  const sendMessage = async ({ msg, address }) => {
    try {
      if (!msg) {
        setError("Please Enter a Message");
        return;
      }
      const contract = await connectingWithContract();
      const addMessage = await contract.sendMessage(address, msg);
      setLoading(true);
      await addMessage.wait();
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setError("Please reload and try again");
      console.error(error);
    }
  };

  // READ INFO
  const readUser = async (userAddress) => {
    try {
      const contract = await connectingWithContract();
      const userName = await contract.getUserName(userAddress);
      setCurrentUserName(userName);
      setCurrentUserAddress(userAddress);
    } catch (error) {
      setError("Error reading user info");
      console.error(error);
    }
  };

  return (
    <ChatAppContext.Provider
      value={{
        readMessage,
        createAccount,
        addFriends,
        sendMessage,
        readUser,
        connectWallet,
        checkIfWalletIsConnected,
        account,
        userName,
        friendLists,
        friendMsg,
        userLists,
        loading,
        error,
        currentUserName,
        currentUserAddress,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};
