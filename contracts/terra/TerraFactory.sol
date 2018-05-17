pragma solidity ^0.4.21;

import './TerraToken.sol';

contract TerraFactory {

  mapping (address => address[]) public created;

  address[] public tokens;

  event NewRegistry(
    address indexed contractAddress,
    address indexed owners,
    string name,
    string symbol
  );

  function createTerraToken(string _name, string _symbol) public
    returns (address) {

      TerraToken terra = new TerraToken(_name, _symbol);

      created[msg.sender].push(address(terra));

      /* if (created[msg.sender].length == 1) {
        owners.push(msg.sender);
      } */
      tokens.push(address(terra));

      emit NewRegistry(address(terra), msg.sender, _name, _symbol);
      /* terra.transferFrom(address(this), msg.sender, terra.INITIAL_SUPPLY()); */
      return terra;
  }

  function getTokens() public view returns (address[]) {
    return tokens;
  }
/*
  function getContract(address _addr) public view returns (TerraToken) {
    return TerraToken(_addr);
  } */
}
