import { Web3Storage, File } from "web3.storage";
import * as dotenv from "dotenv";

dotenv.config();

function getClient() {
  const token = process.env.WEB3_STORAGE_TOKEN;
  if (!token) {
    throw new Error("WEB3_STORAGE_TOKEN not set in .env");
  }
  return new Web3Storage({ token });
}

async function main() {
  const client = getClient();

  const metadata = {
    title: "Sample research IP",
    abstract: "Demonstration of IPNFT metadata pinned via Web3.Storage.",
    institution: "Demo Institute",
    category: "Demo",
    pi_name: "Demo PI",
    link: "https://example.org/demo-paper"
  };

  const blob = new Blob([JSON.stringify(metadata, null, 2)], {
    type: "application/json"
  });

  const files = [new File([blob], "metadata.json")];
  const cid = await client.put(files);

  console.log("Pinned metadata CID:", cid);
  console.log("Gateway URL: https://ipfs.io/ipfs/" + cid + "/metadata.json");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
