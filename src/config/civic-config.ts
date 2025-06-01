import type { CivicConfig } from '../types/civic.js';

export const CIVIC_CONFIG: CivicConfig = {
  API_BASE_URL: 'https://api.civic.com',
  AUTH_URL: 'https://auth.civic.com/oauth/token',
  
  // Official Sandbox Environment from Civic docs
  SANDBOX: {
    clientId: 'dtVTGsKUlkPQ8UXKqSskS1HqNI3hERHT',
    clientSecret: '7DT722BjNlXUp8HVaV_ZjHzopq2Tr12doGB8sBYC-vhPo3Eh0HoidLVATFbxmwZ1',
    gatekeeperNetwork: 'tgnuXXNMDLK8dy7Xm1TdeGyc95MDym4bvAQCwcW21Bf',
  },

  // Universal Network Configurations
  NETWORKS: {
    'xdc-apothem': {
      name: 'XDC Apothem Testnet',
      chainId: 51,
      rpc: 'https://erpc.apothem.network',
      explorer: 'https://explorer.apothem.network',
      civicChain: 'ethereum',
      civicChainNetwork: 'xdcApothem',
    },
    'xdc-mainnet': {
      name: 'XDC Mainnet',
      chainId: 50,
      rpc: 'https://erpc.xinfin.network',
      explorer: 'https://explorer.xinfin.network',
      civicChain: 'ethereum',
      civicChainNetwork: 'xdcMainnet',
    },
    'ethereum-sepolia': {
      name: 'Ethereum Sepolia',
      chainId: 11155111,
      rpc: 'https://sepolia.infura.io/v3/',
      explorer: 'https://sepolia.etherscan.io',
      civicChain: 'ethereum',
      civicChainNetwork: 'sepolia',
    },
    'polygon-amoy': {
      name: 'Polygon Amoy',
      chainId: 80002,
      rpc: 'https://rpc-amoy.polygon.technology',
      explorer: 'https://amoy.polygonscan.com',
      civicChain: 'ethereum',
      civicChainNetwork: 'polygonAmoy',
    },
    'solana-devnet': {
      name: 'Solana Devnet',
      chainId: 'devnet',
      rpc: 'https://api.devnet.solana.com',
      explorer: 'https://explorer.solana.com',
      civicChain: 'solana',
      civicChainNetwork: 'devnet',
    },
  },
} as const;
