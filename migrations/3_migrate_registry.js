var Registry = artifacts.require("./eip20/ContractRegistry.sol");

module.exports = function(deployer) {
  // deployment steps
  // uint256 _initialAmount,
  // string _tokenName,
  // uint8 _decimalUnits,
  // string _tokenSymbol
  deployer.deploy(Registry);
};
