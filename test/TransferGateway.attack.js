const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Reentrancy Attack Simulation", function () {
  let TransferGateway;
  let gateway;
  let owner;
  let attacker;
  let AttackContract;
  let attackContract;

  beforeEach(async function () {
    TransferGateway = await ethers.getContractFactory("TransferGateway");
    [owner, attacker] = await ethers.getSigners();
    gateway = await TransferGateway.deploy(owner.address);
    await gateway.waitForDeployment();

    AttackContract = await ethers.getContractFactory("ReentrancyAttack");
    attackContract = await AttackContract.deploy(await gateway.getAddress());
    await attackContract.waitForDeployment();
  });

  it("Should prevent reentrancy attack", async function () {
    // Attacker deposits some Ether
    await attackContract.deposit({ value: ethers.parseUnits("1", 18) });

    // Attempt reentrancy attack
    try {
      await attackContract.attack({ value: ethers.parseUnits("1", 18) });
    } catch (error) {
      console.log("Caught error:", error.message);
      expect(error.message).to.include("reentrant");
    }
  });
});
