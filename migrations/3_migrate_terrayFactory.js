var TerraFactory = artifacts.require("./terra/TerraFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(TerraFactory);
};
