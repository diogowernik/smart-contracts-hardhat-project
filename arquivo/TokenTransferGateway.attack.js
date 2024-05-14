const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Attack Simulation", function () {
  let TokenTransferGateway;
  let gateway;
  let owner;
  let attacker;
  let AttackContract;
  let attackContract;

  beforeEach(async function () {
    TokenTransferGateway = await ethers.getContractFactory("TokenTransferGateway");
    [owner, attacker] = await ethers.getSigners();
    gateway = await TokenTransferGateway.deploy(owner.address);
    // Remover await gateway.deployed();

    AttackContract = await ethers.getContractFactory("ReentrancyAttack");
    attackContract = await AttackContract.deploy(gateway.address);
    // Remover await attackContract.deployed();
  });

  it("Should prevent reentrancy attack", async function () {
    // Attacker deposits some Ether
    await attackContract.deposit({ value: ethers.utils.parseEther("1") });

    // Attempt reentrancy attack
    await expect(attackContract.attack({ value: ethers.utils.parseEther("1") }))
      .to.be.revertedWith("ReentrancyGuard: reentrant call");
  });
});
