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
    [owner, addr1, addr2] = await ethers.getSigners();
    gateway = await TokenTransferGateway.deploy(owner.address);
    await gateway.waitForDeployment();

    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("MockToken", "MTK", owner.address, ethers.parseUnits("1000", 18));
    await token.waitForDeployment();
  });

  it("Should set the right owner", async function () {
    expect(await gateway.owner()).to.equal(owner.address);
  });

  it("Should allow owner to set token whitelist", async function () {
    await gateway.setTokenWhitelist(token.target, true);
    expect(await gateway.allowedTokens(token.target)).to.be.true;
  });

  it("Should transfer native currency with fee", async function () {
    const amount = ethers.parseUnits("1", 18);
    await gateway.connect(addr1).transferNative(addr2.address, { value: amount });
    const fee = amount.mul(ethers.BigNumber.from(50)).div(ethers.BigNumber.from(10000));
    const amountAfterFee = amount.sub(fee);

    // Adicione uma verificação para o saldo após a transferência
    const recipientBalance = await ethers.provider.getBalance(addr2.address);
    expect(recipientBalance).to.equal(amountAfterFee);
  });

  it("Should transfer ERC20 tokens with fee", async function () {
    await gateway.setTokenWhitelist(token.target, true);
    const amount = ethers.parseUnits("100", 18);
    await token.connect(owner).transfer(addr1.address, amount);
    await token.connect(addr1).approve(gateway.target, amount);
    await gateway.connect(addr1).transferToken(token.target, addr2.address, amount);
    const fee = amount.mul(ethers.BigNumber.from(50)).div(ethers.BigNumber.from(10000));
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
    await expect(gateway.transferNative(addr2.address, { value: ethers.parseUnits("1", 18) }))
      .to.be.revertedWith("Pausable: paused");
    await gateway.unpause();
    await expect(gateway.transferNative(addr2.address, { value: ethers.parseUnits("1", 18) })).to.not.be.reverted;
  });
});
