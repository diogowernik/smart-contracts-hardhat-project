// deployTransfer.js

const main = require('./deployMain');
const saveContractAddress = require('./saveContractAddress');
const { ethers } = require("hardhat");

async function deployTransferGateway(networkName, deployer) {
    console.log(`Deploying TransferGateway on ${networkName} with the account:`, deployer.address);
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    const TransferGateway = await ethers.getContractFactory("TransferGateway");
    const tokenTransferGateway = await TransferGateway.deploy(deployer.address);
    await tokenTransferGateway.waitForDeployment();

    console.log(`TransferGateway target on ${networkName}:`, tokenTransferGateway.target);
    saveContractAddress(networkName, "TransferGateway", tokenTransferGateway.target);
}

// Usar o módulo main com a função específica de deploy
main(deployTransferGateway);
