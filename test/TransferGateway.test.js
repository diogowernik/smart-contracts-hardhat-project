const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TransferGateway", function () {
  let TransferGateway;
  let gateway;
  let owner;
  let addr1;
  let addr2;
  let token;

  beforeEach(async function () {
    // Obter a fábrica do contrato TransferGateway
    TransferGateway = await ethers.getContractFactory("TransferGateway");
    [owner, addr1, addr2] = await ethers.getSigners();
    
    // Implantar o contrato TransferGateway
    gateway = await TransferGateway.deploy(owner.address);
    await gateway.waitForDeployment(); // Esperar a implantação ser finalizada

    // Obter a fábrica do contrato ERC20Mock
    const Token = await ethers.getContractFactory("ERC20Mock");
    token = await Token.deploy("MockToken", "MTK", owner.address, ethers.parseUnits("1000", 18));
    await token.waitForDeployment(); // Esperar a implantação ser finalizada
  });

  it("Should log contract addresses and signers", async function () {
    // Logs para verificar os endereços dos contratos e signatários
    console.log("Gateway address:", await gateway.getAddress());
    console.log("Token address:", await token.getAddress());
    console.log("Owner address:", owner.address);
    console.log("Addr1 address:", addr1.address);
    console.log("Addr2 address:", addr2.address);  

    // targets não remover - necessário para os testes
    console.log("Token target:", token.target);
    console.log("Gateway target:", gateway.target);
  });
  
  it("Should set the right owner", async function () {
    expect(await gateway.owner()).to.equal(owner.address);
  }); // ok passou não mexer 

  it("Should allow owner to set token whitelist", async function () {
    await gateway.setTokenWhitelist(token.target, true);
    expect(await gateway.allowedTokens(token.target)).to.be.true;
  }); // ok passou não mexer

  it("Should transfer native currency with fee", async function () {
    // Redefinir o saldo de addr2 para zero
    await ethers.provider.send("hardhat_setBalance", [
      addr2.address,
      "0x0",
    ]);
  
    const amount = ethers.parseUnits("1", 18);
    await gateway.connect(addr1).transferNative(addr2.address, { value: amount });
  
    // Convertendo para BigInt usando ethers.toBigInt
    const amountBigInt = ethers.toBigInt(amount);
    const fee = amountBigInt * 50n / 10000n;
    const amountAfterFee = amountBigInt - fee;
  
    // Check balances
    const recipientBalance = await ethers.provider.getBalance(addr2.address);
    const recipientBalanceBigInt = ethers.toBigInt(recipientBalance);
  
    // Logs para depuração
    console.log("Amount:", amountBigInt.toString());
    console.log("Fee:", fee.toString());
    console.log("Amount after fee:", amountAfterFee.toString());
    console.log("Recipient balance:", recipientBalanceBigInt.toString());
  
    expect(recipientBalanceBigInt).to.equal(amountAfterFee);
  });
  
  it("Should transfer ERC20 tokens with fee", async function () {
    await gateway.setTokenWhitelist(token.target, true);
  
    const amount = ethers.parseUnits("100", 18);
    await token.connect(owner).transfer(addr1.address, amount);
    await token.connect(addr1).approve(gateway.target, amount);
  
    // Redefinindo saldos de owner e addr2 para zero
    const initialOwnerBalance = await token.balanceOf(owner.address);
    const initialAddr2Balance = await token.balanceOf(addr2.address);
  
    if (initialOwnerBalance > 0) {
      await token.connect(owner).transfer(addr1.address, initialOwnerBalance);
    }
  
    if (initialAddr2Balance > 0) {
      await token.connect(addr2).transfer(owner.address, initialAddr2Balance);
    }
  
    // Executar a transferência de tokens através do gateway
    await gateway.connect(addr1).transferToken(token.target, addr2.address, amount);
  
    // Convertendo para BigInt usando ethers.toBigInt
    const amountBigInt = ethers.toBigInt(amount);
    const fee = amountBigInt * 50n / 10000n;
    const amountAfterFee = amountBigInt - fee;
  
    // Verificar saldo de addr2
    const addr2Balance = await token.balanceOf(addr2.address);
    const addr2BalanceBigInt = ethers.toBigInt(addr2Balance);
    console.log("addr2 Balance:", addr2BalanceBigInt.toString());
    expect(addr2BalanceBigInt).to.equal(amountAfterFee);
  
    // Verificar saldo de owner
    const ownerBalance = await token.balanceOf(owner.address);
    const ownerBalanceBigInt = ethers.toBigInt(ownerBalance);
    console.log("owner Balance:", ownerBalanceBigInt.toString());
    expect(ownerBalanceBigInt).to.equal(fee);
  });
  
  it("Should update the fee", async function () {
    await gateway.setFee(75);
    expect(await gateway.feeBps()).to.equal(75);
  });

  it("Should pause and unpause the contract", async function () {
    await gateway.pause();
  
    // Tentar realizar a transferência e capturar o erro
    let errorMessage = "";
    try {
      await gateway.transferNative(addr2.address, { value: ethers.parseUnits("1", 18) });
    } catch (error) {
      errorMessage = error.message;
      console.log(errorMessage); // Imprimir a mensagem de erro
    }
  
    // Verificar se a mensagem de erro completa contém 'EnforcedPause'
    expect(errorMessage).to.include("EnforcedPause");
  
    await gateway.unpause();
    await expect(gateway.transferNative(addr2.address, { value: ethers.parseUnits("1", 18) })).to.not.be.reverted;
  });

});
