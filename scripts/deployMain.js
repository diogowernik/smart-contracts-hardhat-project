// deployMain.js

async function main(deployFunction) {
    const [deployer] = await ethers.getSigners();
    const networkName = hre.network.name;
    console.log(`Starting deployment on the network: ${networkName}`);
    
    try {
        await deployFunction(networkName, deployer);
    } catch (error) {
        console.error("Deployment failed:", error);
        process.exit(1);
    }

    console.log("Deployment completed successfully.");
    process.exit(0);
}

module.exports = main;
