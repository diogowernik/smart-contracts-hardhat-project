//SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

contract BuyCoffee {

  struct Coffee {
    address supporter;
    string message;
    string name;
    uint256 amount;
    uint256 timestamp;
  }

  Coffee[] coffee;

  address payable public owner;

  constructor() payable {
    console.log("Initialize Smart Contract");
    owner = payable(msg.sender);
  }

  function buyCoffee(
    string memory _message, 
    string memory _name) 
    public payable {
    require(msg.sender.balance >= msg.value, "You don't have enough ETH");

    coffee.push(Coffee(
      msg.sender, _message, _name, 
      msg.value, 
      block.timestamp));
  }

  function getAllCoffee() public view returns (Coffee[] memory) {
    return coffee;
  }

  function getBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function withdraw() public {
    require(owner == msg.sender, "Caller is not the owner");

    uint256 amount = address(this).balance;
    require(amount > 0, "You have no ethers to withdraw");

    (bool success, ) = owner.call{value: amount}("");
    require(success, "Withdraw failed");
  }  
}