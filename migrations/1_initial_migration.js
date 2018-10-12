var Election = artifacts.require("./Consumer.sol");

module.exports = function(deployer) {
  deployer.deploy(Election);
};
