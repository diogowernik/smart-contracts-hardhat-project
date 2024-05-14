const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Gas Usage", function () {
  let TokenTransferGateway;
  let gateway;
  let owner;
  let addr1;
  let token;

  beforeEach(async function () {
    TokenTransferGateway = await ethers.getContractFactory("TokenTransferGateway");
    [owner, addr1] = await ethers.getSigners();
    gateway = await TokenTransferGateway.deploy(owner.address);
    // Remover await gateway.deployed();

    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("MockToken", "MTK", owner.address, ethers.utils.parseEther("1000"));
    // Remover await token.deployed();
  });

  it("Gas usage for transferNative", async function () {
    const tx = await gateway.connect(addr1).transferNative(addr1.address, { value: ethers.utils.parseEther("1") });
    const receipt = await tx.wait();
    console.log("Gas used for transferNative:", receipt.gasUsed.toString());
  });

  it("Gas usage for transferToken", async function () {
    await gateway.setTokenWhitelist(token.address, true);
    const amount = ethers.utils.parseEther("100");
    await token.connect(owner).transfer(addr1.address, amount);
    await token.connect(addr1).approve(gateway.address, amount);
    const tx = await gateway.connect(addr1).transferToken(token.address, addr1.address, amount);
    const receipt = await tx.wait();
    console.log("Gas used for transferToken:", receipt.gasUsed.toString());
  });
});
