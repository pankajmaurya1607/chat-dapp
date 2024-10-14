import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { contractAddress, ChatAppABI } from "../Context/constants";


export const checkIfWalletIsConnected = async () => {
    try {
        if (!window.ethereum) return alert("Please install Metamask");
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        const firstAccount = accounts[0];
        return firstAccount;
    }
    catch (error) {
        console.log(error);
    }
}


export const connectWallet = async () => {
    try {
        if (!window.ethereum) return alert("Please install Metamask");
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const firstAccount = accounts[0];
        return firstAccount;
    }
    catch (error) {
        console.log(error);
    }
}

const fetchContract = (signerOrProvider) => {
    return new ethers.Contract(contractAddress, ChatAppABI, signerOrProvider);
}

export const connectingWithContract = async () => {
    try {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.BrowserProvider(connection);
        const signer = await provider.getSigner();
        const contract = fetchContract(signer);
        return contract;
    }
    catch (error) {
        console.log(error);
    }
}


export const convertTime = (time) => {
    const newTime = new Date(time.toNumber());

    const realTime = newTime.getHours() + 
    "/" + 
    newTime.getMinutes() +
    "/" +
    newTime.getSeconds() + 
    "  Date: "+
    newTime.getDate() +
    "/" +
    (newTime.getMonth() + 1) + 
    "/" +
    newTime.getFullYear();

    return realTime;
}