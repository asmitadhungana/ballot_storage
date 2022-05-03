const { current } = require("@openzeppelin/test-helpers/src/balance");
const { expect } = require("chai");
const { ethers } = require("hardhat");

let ballot;
let voteEndTime;
let startTime;

const doDeployBallotContract = async () => {
  const blockNumber = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNumber);
  startTime = block.timestamp;

  [deployer, voter1, voter2, voter3] = await ethers.getSigners();

  const proposalOneInBytes32 = ethers.utils.formatBytes32String("A");
  const proposalTwoInBytes32 = ethers.utils.formatBytes32String("B");

  const Ballot = await hre.ethers.getContractFactory("Ballot");
  ballot = await Ballot.deploy([proposalOneInBytes32, proposalTwoInBytes32], startTime);
  await ballot.deployed();
}

const doGiveRightsToVoters = async () => {
  await ballot.connect(deployer).giveRightToVote(voter1.address);
  await ballot.connect(deployer).giveRightToVote(voter2.address);
}

describe("Contract: Ballot", function () {

  describe("Ballot: User Casts Vote Before Vote Ended", function () {
    beforeEach(async () => {
      await doDeployBallotContract();
      await doGiveRightsToVoters();
    });

    it("Should set the start time as given in constructor", async function () {
      const startTimeSet = (await ballot.startTime()).toNumber();
      await expect(startTimeSet).to.equal(startTime);
    });

    it("Should set the end time as 5 minutes after start time", async function () {
      expect(await ballot.voteEndTime()).to.equal(startTime + 5 * 60);
    });

    it("Should allow valid voters to vote", async function () {
      await ballot.connect(voter1).vote(0);
      const voterVotingStatus = await ballot.voters(voter1.address);
      expect(voterVotingStatus.voted).to.equal(true);
    });

    it("Should not allow invalid voters to vote", async function () {
      await expect (
        ballot.connect(voter3).vote(0)
      ).to.be.revertedWith("Has no right to vote");
    })
  });

  describe("Ballot: User Casts Vote After Vote Ended", function () {
    beforeEach(async () => {
      await doDeployBallotContract();
      await doGiveRightsToVoters();
    });

    it("Should let a voter cast vote if the voting hasn't ended", async function () {
      voteEndTime = (await ballot.voteEndTime()).toNumber();
      startTime = (await ballot.startTime());

      await ethers.provider.send("evm_setNextBlockTimestamp", [voteEndTime - 1]);

      await ballot.connect(voter1).vote(1);
      const voterVotingStatus = await ballot.voters(voter1.address);
      expect(voterVotingStatus.voted).to.equal(true);
    });

    it("Should revert if the voting period has ended", async function () {
      voteEndTime = (await ballot.voteEndTime()).toNumber();
      startTime = (await ballot.startTime()).toNumber();

      await ethers.provider.send("evm_setNextBlockTimestamp", [voteEndTime]);

      await expect(
        ballot.connect(voter1).vote(1)
      ).to.be.revertedWith('Vote Ended');
    });
  });  
});
