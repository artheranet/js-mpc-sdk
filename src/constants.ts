export const MPC_AUTH_ENDPOINT = 'https://mpc-auth-test.arthera.net';

export const ARTHERA_MAINNET_ID = 10242;
export const ARTHERA_TESTNET_ID = 10243;

export const ARTHERA_NETWORK_DETAILS = {
  [ARTHERA_MAINNET_ID]: {
    chainId: 0x2802,
    name: "Arthera Mainnet",
    chainName: "Arthera Mainnet",
    nativeCurrency: {
      name: "Arthera",
      symbol: "AA",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.arthera.net/"],
    blockExplorerUrls: ["https://explorer.arthera.net/"],
    minStake: 500_000,
  },
  [ARTHERA_TESTNET_ID]: {
    chainId: 0x2803,
    name: "Arthera Testnet",
    chainName: "Arthera Testnet",
    nativeCurrency: {
      name: "Arthera",
      symbol: "AA",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-test2.arthera.net/"],
    blockExplorerUrls: ["https://explorer-test2.arthera.net"],
    minStake: 500_000,
  }
};
