const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenTransferGateway", function () {
  let TokenTransferGateway;
  let gateway;
  let owner;
  let addr1;
  let addr2;
  let token;

  beforeEach(async function () {
    TokenTransferGateway = await ethers.getContractFactory("TokenTransferGateway");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    gateway = await TokenTransferGateway.deploy(owner.address);
    await gateway.deployed();

    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("MockToken", "MTK", owner.address, ethers.utils.parseEther("1000"));
    await token.deployed();
  });

  it("Should set the right owner", async function () {
    expect(await gateway.owner()).to.equal(owner.address);
  });

  it("Should allow owner to set token whitelist", async function () {
    await gateway.setTokenWhitelist(token.address, true);
    expect(await gateway.allowedTokens(token.address)).to.be.true;
  });

  it("Should transfer native currency with fee", async function () {
    const amount = ethers.utils.parseEther("1");
    await gateway.connect(addr1).transferNative(addr2.address, { value: amount });
    const fee = amount.mul(50).div(10000);
    const amountAfterFee = amount.sub(fee);

    // Add your assertions here
  });

  it("Should transfer ERC20 tokens with fee", async function () {
    await gateway.setTokenWhitelist(token.address, true);
    const amount = ethers.utils.parseEther("100");
    await token.connect(owner).transfer(addr1.address, amount);
    await token.connect(addr1).approve(gateway.address, amount);
    await gateway.connect(addr1).transferToken(token.address, addr2.address, amount);
    const fee = amount.mul(50).div(10000);
    const amountAfterFee = amount.sub(fee);

    expect(await token.balanceOf(addr2.address)).to.equal(amountAfterFee);
    expect(await token.balanceOf(owner.address)).to.equal(fee);
  });

  it("Should update the fee", async function () {
    await gateway.setFee(75);
    expect(await gateway.feeBps()).to.equal(75);
  });

  it("Should pause and unpause the contract", async function () {
    await gateway.pause();
    await expect(gateway.transferNative(addr2.address, { value: 1 })).to.be.revertedWith("Pausable: paused");
    await gateway.unpause();
    await expect(gateway.transferNative(addr2.address, { value: 1 })).to.not.be.reverted;
  });
});
