const { expect } = require("chai");
const { ethers } = require("hardhat");

const deployedContracts = require("../deployedContracts.json");

let ballot;

const doFetchBallotContract = async () => {
  const ballotAddress = deployedContracts.BallotAddress;

  // ATTACH THE CONTRACT ABI TO THE CONTRACT ADDRESS
  ballot = await hre.ethers.getContractAt("Ballot", ballotAddress);
}

const doGiveRightToVoter = async (voterId) => {
  let voter = eval(`voter${voterId}`);
  await ballot.connect(deployer).giveRightToVote(voter.address);
}

async function main() {
  [deployer, voter1, voter2, voter3, voter4] = await ethers.getSigners();

  // NOTE: CHANGE THE `voterId` FROM 1 to 4 CONSECUTIVELY IN SHORT INTERVALS TO CASTE VOTE WITH ONE ID AT A TIME
  const voterId = 1;

  await doFetchBallotContract();
  await doGiveRightToVoter(voterId);

  // QUERY THE VOTE-START-TIME AND VOTE-END-TIME 
  const voteEndTime = (await ballot.voteEndTime()).toNumber();
  const startTime = (await ballot.startTime()).toNumber();

  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);

  // QUERY THE CURRENT TIMESTAMP
  console.log(`Current timestamp is: ${block.timestamp}`);

  console.log("Vote start timestamp:", startTime);
  console.log("Vote end timestamp:", voteEndTime);
  console.log(`Current timestamp is: ${block.timestamp}`);

  console.log(`Time elapsed since Start Time is:", ${(block.timestamp - startTime)/60} mins` );

  await ballot.connect(eval(`voter${voterId}`)).vote(1);
  const voterVotingStatus = await ballot.voters(eval(`voter${voterId}`).address);
  console.log(`Voting status of voter ${voterId} is: ${voterVotingStatus.voted}`);
  console.log(`Ballot contract address is: ${ballot.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
});
