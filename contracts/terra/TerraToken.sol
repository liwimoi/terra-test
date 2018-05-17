pragma solidity ^0.4.21;

import '../../node_modules/openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol';

contract TerraToken is StandardToken {

  string public name; // solium-disable-line uppercase
  string public symbol; // solium-disable-line uppercase
  uint8 public constant decimals = 18; // solium-disable-line uppercase

  uint256 public constant INITIAL_SUPPLY = 100;

  address private sender;

  constructor(string _name, string _symbol) public {

    name = _name;
    symbol = _symbol;

    totalSupply_ = INITIAL_SUPPLY;
    sender = msg.sender;
    balances[msg.sender] = INITIAL_SUPPLY;
    emit Transfer(0x0, msg.sender, INITIAL_SUPPLY);
  }

  function checkSender() public view returns (address) {
    return sender;
  }
}
