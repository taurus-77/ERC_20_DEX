const HDWalletProvider = require("@truffle/hdwallet-provider");
const infuraKey = "032cbfbf94014485bdb69578bc877f22";
const path = require("path");
const fs = require("fs");
const { mnemonic } = require('./secret.json');

module.exports = {
  /**
   * $ truffle deploy --network <network-name>
   */
  contracts_build_directory: path.join(__dirname, "client/contracts"),
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, // Standard Ethereum port (default: none)
      network_id: "*", // Any network (default: none)
    },
    ropsten: {
      provider: () =>
        new HDWalletProvider({
          mnemonic,
          providerOrUrl: `https://ropsten.infura.io/v3/${infuraKey}`,
          chainId: 3,
        }),
      network_id: 3, // Ropsten's id
      gas: 5500000, // Ropsten has a lower block limit than mainnet
      confirmations: 2, // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
    },
  },
  compilers: {
    solc: {
      version: "0.8.1",
    },
  },
};
