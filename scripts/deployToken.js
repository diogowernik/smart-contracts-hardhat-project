const main = require('./deployMain');
const saveContractAddress = require('./saveContractAddress');
const { ethers } = require("hardhat");

async function deployWtreeToken(networkName, deployer) {
    console.log(`Deploying WtreeToken on ${networkName} with the account:`, deployer.address);
    const balance = await deployer.provider.getBalance(deployer.address);
    console.log("Account balance:", ethers.formatEther(balance), "ETH");

    const WtreeToken = await ethers.getContractFactory("WtreeToken");
    // Supondo que o deployer também será o initialOwner
    const wtreeToken = await WtreeToken.deploy(deployer.address);
    await wtreeToken.waitForDeployment();

    console.log(`WtreeToken target on ${networkName}:`, wtreeToken.target);
    saveContractAddress(networkName, "WtreeToken", wtreeToken.target);
}

// Usar o módulo main com a função específica de deploy
main(deployWtreeToken);
