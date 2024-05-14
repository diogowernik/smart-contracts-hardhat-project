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
    await gateway.waitForDeployment();

    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("MockToken", "MTK", owner.address, ethers.parseUnits("1000", 18));
    await token.waitForDeployment();
  });

  it("Gas usage for transferNative", async function () {
    const tx = await gateway.connect(addr1).transferNative(addr1.address, { value: ethers.parseUnits("1", 18) });
    const receipt = await tx.wait();
    console.log("Gas used for transferNative:", receipt.gasUsed.toString());
  });

  it("Gas usage for transferToken", async function () {
    await gateway.setTokenWhitelist(token.target, true); // Use token.target
    const amount = ethers.parseUnits("100", 18);
    await token.connect(owner).transfer(addr1.address, amount);
    await token.connect(addr1).approve(gateway.target, amount); // Use gateway.target
    const tx = await gateway.connect(addr1).transferToken(token.target, addr1.address, amount); // Use token.target
    const receipt = await tx.wait();
    console.log("Gas used for transferToken:", receipt.gasUsed.toString());
  });
});
