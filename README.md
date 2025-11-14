# ipnft-scripts

Small Node + TypeScript utilities for the IPNFT demo.

## Setup

```bash
npm install
cp .env.example .env
# edit .env with your values

Commands

npm run pin – create sample metadata JSON, upload to Web3.Storage, print CID.

npm run mint – upload metadata, then call mint(recipient, uri) on IPNFT on Base Sepolia.

These scripts assume the IPNFT contract from ipnft-contract is already deployed.
