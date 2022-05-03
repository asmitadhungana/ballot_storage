const hre = require("hardhat");
const ethers = require('ethers')

async function main() {
  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);
  startTime = block.timestamp;

  const proposalOneInBytes32 = ethers.utils.formatBytes32String("A");
  const proposalTwoInBytes32 = ethers.utils.formatBytes32String("B");

  const Ballot = await hre.ethers.getContractFactory("Ballot");
  ballot = await Ballot.deploy([proposalOneInBytes32, proposalTwoInBytes32], startTime);
  await ballot.deployed();

  console.log("Ballot deployed to:", ballot.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
