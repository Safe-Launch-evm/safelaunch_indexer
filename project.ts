import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

import * as dotenv from 'dotenv';
import path from 'path';

const mode = process.env.NODE_ENV || 'production';

// Load the appropriate .env file
const dotenvPath = path.resolve(__dirname, `.env${mode !== 'production' ? `.${mode}` : ''}`);
dotenv.config({ path: dotenvPath });

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "Safe Launch",
  description:
    "SafeLaunch ensures every token is fair-launched with no presale and no team allocation",
  runner: {
    node: {
      name: "@subql/node-ethereum",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the EVM Chain ID, for Asset Chain Testnet this is 42421
     * https://chainlist.org/chain/42421
     */
    chainId: process.env.CHAIN_ID!,
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: process.env.ENDPOINT!?.split(",") as string[] | string,
  },
  dataSources: [
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: 98568,
      options: {
        abi: "tokenfactory",
        address: "0x70E3ab94CAC2316878f348d2bA0f669067925bD6",
      },
      assets: new Map([
        ["tokenfactory", { file: "./abis/tokenfactory.abi.json" }],
      ]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleTokenCreationLog",
            filter: {
              topics: [
                "TokenCreated(address indexed tokenAddress, address indexed deployer, string tokenName, string tokenSymbol)",
              ],
            },
          },
        ],
      },
    },
    {
      kind: EthereumDatasourceKind.Runtime,
      startBlock: 98570,
      options: {
        abi: "safelaunch",
        address: "0x2B7C1342Cc64add10B2a79C8f9767d2667DE64B2",
      },
      assets: new Map([["safelaunch", { file: "./abis/safelaunch.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: EthereumHandlerKind.Event,
            handler: "handleTokenSwapLog",
            filter: {
              topics: [
                "TokenSwapped(address indexed token, string txnType, uint256 amount, uint24 fee, uint256 timestamp, address user)",
              ],
            },
          },
        ],
      },
    },
  ],
  repository: "https://github.com/Safe-Launch-evm/safelaunch_indexer",
};

// Must set default to the project instance
export default project;
