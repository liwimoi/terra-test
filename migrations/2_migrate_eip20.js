var EIP20 = artifacts.require("./eip20/EIP20.sol");

module.exports = function(deployer) {
  // deployment steps
  // uint256 _initialAmount,
  // string _tokenName,
  // uint8 _decimalUnits,
  // string _tokenSymbol
  deployer.deploy(EIP20, 100, "terra-test", 18, "TT");
};
