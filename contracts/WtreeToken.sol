// SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

// Importando a biblioteca console do hardhat para debugs quando necessário
import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract WtreeToken is ERC20, Ownable, ReentrancyGuard {
    // Modificado para aceitar um endereço inicial como owner
    constructor(address initialOwner) ERC20("Wallet Tree Token", "WTREE") Ownable(initialOwner) {
        _mint(msg.sender, 18_000_000 * (10 ** uint256(decimals()))); // Suprimento inicial
    }

    function transfer(address recipient, uint256 amount) public override nonReentrant returns (bool) {
        return super.transfer(recipient, amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override nonReentrant returns (bool) {
        return super.transferFrom(sender, recipient, amount);
    }
}
