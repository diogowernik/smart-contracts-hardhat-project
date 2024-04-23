async function main() {
  const BuyCoffee = await hre.ethers.getContractFactory("BuyCoffee");
  const buycoffee = await BuyCoffee.deploy();
  await buycoffee.deployed();

  console.log("BuyCoffee's contract address: ", buycoffee.address);
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
