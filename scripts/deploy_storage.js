const hre = require("hardhat");
const ethers = require('ethers')

async function main() {
  const Storage = await ethers.getContractFactory("Storage");
  storage = await Storage.deploy();
  await storage.deployed();

  console.log("Storage deployed to:", storage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
