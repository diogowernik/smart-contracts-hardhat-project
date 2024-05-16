// deployTransfer.js

const main = require('./deployMain');
const saveContractAddress = require('./saveContractAddress');
const { ethers } = require("hardhat");

async function deployTokenTransferGateway(networkName, deployer) {
    console.log(`Deploying TokenTransferGateway on ${networkName} with the account:`, deployer.address);
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    const TokenTransferGateway = await ethers.getContractFactory("TokenTransferGateway");
    const tokenTransferGateway = await TokenTransferGateway.deploy(deployer.address);
    await tokenTransferGateway.waitForDeployment();

    console.log(`TokenTransferGateway target on ${networkName}:`, tokenTransferGateway.target);
    saveContractAddress(networkName, "TokenTransferGateway", tokenTransferGateway.target);
}

// Usar o módulo main com a função específica de deploy
main(deployTokenTransferGateway);
