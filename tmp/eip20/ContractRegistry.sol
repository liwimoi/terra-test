pragma solidity ^0.4.23;

contract ContractRegistry {

  struct ContractInfo {
    address author;
    string abi;
    bool registered;
  }

  address[] public contracts;

  mapping (address => ContractInfo) public contractInfos;

  event NewRegistry(address indexed contractAddress, address indexed author, string contractAbi);

  function register(address contractAddress, string contractAbi) public returns (bool success) {
    require(contractInfos[contractAddress].registered == false);
    ContractInfo storage ci = contractInfos[contractAddress];
    ci.author = msg.sender;
    ci.abi = contractAbi;
    ci.registered = true;
    contracts.push(contractAddress);
    emit NewRegistry(contractAddress, msg.sender, contractAbi);
    return true;
  }

}
