// It is used to sign transactions for web3 wallet.
const HDWalletProvider = require("truffle-hdwallet-provider");

// It is used to interact with Ethereum smart contracts
const Web3 = require("web3");

// Interface and bytecode object from compiled exhibition contract
const { interface, bytecode } = require("./compile");

// list of 12 words key to connect account. You can get this key when you setup a MetaMask
var mnemonic =
  "worry wrestle broom boring lady envelope wave member upset gain essay custom";

// Infur rinkeby API url.
// Specify ethereum network need to connect to
var accessToken = "https://ropsten.infura.io/v3/76c9640a129e45acaf1c977dd63aed89";

// Create a wallet provider to connect outside rinkeby network
const provider = new HDWalletProvider(mnemonic, accessToken, 1);

// Create a new instance of web3 with wallet provider and ulock the rinkeby account
const web3 = new Web3(provider);

// This function is used to deploy contract
const deploy = async () => {
  // Get list of accounts
  const accounts = await web3.eth.getAccounts();

  const ABI = interface;

  // Create a contract with exhibition ABI, then deply with bytecode
  // and then finally send a transaction to rinkeby network with gas
  // and which account its deploy from
  const result = await new web3.eth.Contract(JSON.parse(ABI))
    .deploy({
      data: bytecode
    })
    .send({ from: accounts[0], gas: "1000000" });
  // Note this address. It will be used to create contract instance from Angular 5 application.
  console.log("contract deployed to", result.options.address);
};

// Call deploy function.
deploy();