// Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
        
import { local } from "web3modal";
import chatAppJSON from "./ChatApp.json";

export const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ChatAppABI = chatAppJSON.abi;



// NETWORK
export const networks = {
  localhost: {
    chainId: `0x${Number(31337).toString(16)}`,
    chainName: "localhost",
    nativeCurrency: {
      name: "GO",
      symbol: "GO",
      decimals: 18,
    },
    rpcUrls: ["http://127.0.0.1:8545/"],
    blockExplorerUrls: ["https://etherscan.io/"],
  },
};


const changeNetwork = async () => {
  try {
    if(!window.ethereum) return alert("Please install Metamask");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{ ...networks[networkName] }],
    });
  } catch (error) {
    console.log(error);
  }
};

export const handleNetworkSwitch = async () => {
  const networkName = "localhost";
  await changeNetwork({ networkName});
};