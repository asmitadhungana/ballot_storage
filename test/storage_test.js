const { expect } = require("chai");
const { ethers } = require("hardhat");

let storage;

const doDeployStorageContract = async () => {
  const Storage = await ethers.getContractFactory("Storage");
  storage = await Storage.deploy();
  await storage.deployed();
}

describe("Storage", function () {
  beforeEach(async () => {
    await doDeployStorageContract();
  });

  it("returns the initial value in number", async function () {
    expect((await storage.retrieveNumber()).toNumber()).to.equal(0);
  });

  it("updates number to new value and retrieves it", async function () {
    await storage.storeNumber(10);
    expect((await storage.retrieveNumber()).toNumber()).to.equal(10);
  });
});