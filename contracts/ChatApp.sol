// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatApp {

    struct user {
        string name;
        friend[] friendList;
    }
     
    struct friend { 
        address pubkey;
        string name;
    }   

    struct message {
        address sender;
        uint256 timestamp;
        string msg;
    }

    struct AllUserStruct {  // Fixed typo in struct name
        string name;
        address accountAddress;
    }

    AllUserStruct[] getAllUsers;  // Updated to use the correct struct name

    mapping(address => user) userList;
    mapping(bytes32 => message[]) allMessages;  // Keep the mapping as bytes32 since we use it as a hash
    
    
    /// Checks if a user with the given public key exists in the ChatApp contract.
    function checkUserExists(address pubkey) public view returns (bool) {
        return bytes(userList[pubkey].name).length > 0;
    }

    /// Create Account
    function createAccount(string calldata name) external{
        require(!checkUserExists(msg.sender), "User already exists");
        require(bytes(name).length > 0, "Name cannot be empty"); 
        userList[msg.sender].name = name;
        getAllUsers.push(AllUserStruct(name, msg.sender));  // Updated to use the correct struct name
    }

    /// Get UserName
    function getUserName(address pubkey) external view returns (string memory) {
        require(checkUserExists(pubkey), "User does not exist");
        return userList[pubkey].name;
    }

    /// Add Friends
    function addFriend(address friend_key, string calldata name) external {
        require(checkUserExists(msg.sender), "Create an Account first");
        require(checkUserExists(friend_key), "User does not exist");
        require(msg.sender != friend_key, "Cannot add yourself as a friend");
        require(!checkAlreadyFriend(msg.sender, friend_key), "Already friends");
        _addFriend(msg.sender, friend_key, name);
        _addFriend(friend_key, msg.sender, userList[msg.sender].name);
    }

    /// Check if two users are already friends
    function checkAlreadyFriend(address pubkey1, address pubkey2) internal view returns (bool) {
        if(userList[pubkey1].friendList.length > userList[pubkey2].friendList.length) {
            address temp = pubkey1;
            pubkey1 = pubkey2;
            pubkey2 = temp;
        }
        for(uint256 i = 0; i < userList[pubkey1].friendList.length; i++) { 
            if(userList[pubkey1].friendList[i].pubkey == pubkey2) {
                return true;
            }
        }
        return false;
    }

    /// Add friend to the friend list
    function _addFriend(address me, address friend_key, string memory name) internal {
        friend memory newFriend = friend(friend_key, name);
        userList[me].friendList.push(newFriend);
    }

    /// GET MY Friends
    function getMyFriendsList() external view returns (friend[] memory) {
        return userList[msg.sender].friendList;
    }

    /// Get chat code
    function _getChatCode(address pubkey1, address pubkey2) internal pure returns (bytes32) {
        if(pubkey1 < pubkey2) {
            return keccak256(abi.encodePacked(pubkey1, pubkey2));
        }
        else {
            return keccak256(abi.encodePacked(pubkey2, pubkey1));
        }
    }

    /// Send Message
    function sendMessage(address friend_key, string calldata _message) external {
        require(checkUserExists(msg.sender), "Create an Account first");
        require(checkUserExists(friend_key), "User does not exist");
        require(checkAlreadyFriend(msg.sender, friend_key), "Not friends");
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);
        message memory newMsg = message(msg.sender, block.timestamp, _message);
        allMessages[chatCode].push(newMsg);
    }

    /// Read Message
    function readMessage(address friend_key) external view returns (message[] memory) {
        bytes32 chatCode = _getChatCode(msg.sender, friend_key);    
        return allMessages[chatCode];
    } 

    function getAllAppUser() public view returns (AllUserStruct[] memory) {  // Updated return type
        return getAllUsers;
    }  
}
