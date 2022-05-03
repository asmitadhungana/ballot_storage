const fs = require("fs");
const path = require("path");

const hre = require("hardhat");
const ethers = require('ethers');
const { time } = require('@openzeppelin/test-helpers');

async function addBallotAddressToFile(ballotAddress) {
  try {
    var data = fs.readFileSync(path.resolve(__dirname, "../deployedContracts.json"));
  } catch (err) {
    console.log(err);
  }

  var deployedContracts = JSON.parse(data);

  deployedContracts = {
    ...deployedContracts, 
    BallotAddress: ballotAddress
  }

  fs.writeFileSync(path.resolve(__dirname, "../deployedContracts.json"), JSON.stringify(deployedContracts), err => {
    if (err) throw err;
  });
}

async function main() {
  const startTime = await time.latest();

  const proposalOneInBytes32 = ethers.utils.formatBytes32String("A");
  const proposalTwoInBytes32 = ethers.utils.formatBytes32String("B");

  const Ballot = await hre.ethers.getContractFactory("Ballot");
  ballot = await Ballot.deploy([proposalOneInBytes32, proposalTwoInBytes32], startTime.toNumber());
  await ballot.deployed();

  console.log("Ballot deployed to:", ballot.address);
  console.log("Vote start timestamp:", (await ballot.startTime()).toNumber());

  // ADD THE DEPLOYED BALLOT CONTRACT ADDRESS TO A JSON FILE
  await addBallotAddressToFile(ballot.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
