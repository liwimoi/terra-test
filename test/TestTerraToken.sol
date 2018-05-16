pragma solidity ^0.4.23;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/terra/TerraToken.sol";

contract TestTerraToken {

  TerraToken terra = TerraToken(DeployedAddresses.TerraToken());

  function testSymbol() public {

    terra.symbol;

    Assert.equal(symbol, 'TT', "Symbole is TT");
  }

}
