import { Web3Storage, File } from "web3.storage";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

const WEB3_STORAGE_TOKEN = process.env.WEB3_STORAGE_TOKEN;
const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const IPNFT_ADDRESS = process.env.IPNFT_ADDRESS;
const RECIPIENT_ADDRESS = process.env.RECIPIENT_ADDRESS;

if (!WEB3_STORAGE_TOKEN) throw new Error("WEB3_STORAGE_TOKEN missing");
if (!RPC_URL) throw new Error("BASE_SEPOLIA_RPC_URL missing");
if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY missing");
if (!IPNFT_ADDRESS) throw new Error("IPNFT_ADDRESS missing");
if (!RECIPIENT_ADDRESS) throw new Error("RECIPIENT_ADDRESS missing");

const ipnftAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "uri", "type": "string" }
    ],
    "name": "mint",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function getStorageClient() {
  return new Web3Storage({ token: WEB3_STORAGE_TOKEN! });
}

async function uploadMetadata() {
  const metadata = {
    title: "Sample minted IPNFT",
    abstract: "Metadata for an IPNFT minted via scripts/mintSample.ts",
    institution: "Demo Institute",
    category: "Demo",
    pi_name: "Demo PI",
    link: "https://example.org/demo-paper"
  };

  const blob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: "application/json"
  });
  const files = [new File([blob], "metadata.json")];

  const client = getStorageClient();
  const cid = await client.put(files);
  return cid;
}

async function main() {
  const cid = await uploadMetadata();
  const uri = `ipfs://${cid}/metadata.json`;
  console.log("Metadata CID:", cid);
  console.log("Token URI:", uri);

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);

  const contract = new ethers.Contract(IPNFT_ADDRESS!, ipnftAbi, wallet);

  console.log("Minting IPNFT...");
  const tx = await contract.mint(RECIPIENT_ADDRESS, uri);
  console.log("Tx hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Tx confirmed in block", receipt.blockNumber);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
