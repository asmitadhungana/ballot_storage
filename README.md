## Contracts contained
* [Ballot.sol](contracts/Ballot.sol)
* [Storage.sol](contracts/Storage.sol)

NOTE: All the following commands are to be run in the root folder of this repository.

## Task 1: Install the dependencies
Clone the repository in your local device and in the root folder, run the following command to install all the project dependencies:
`npm install`


## Task 2: Run the tests
```shell
npx hardhat test
```

## Task 3: Run the scripts
1. First, start your hardhat node in a separate terminal
```shell
npx hardhat node
```

2. Second, deploy the ballot smart contract to the hardhat node
```shell
npx hardhat run scripts/1_deploy_ballot.js --network localhost
```

3. Caste vote to the ballot with different voter ids in short intervals to check for voting-timelocks<br/>
**Note**: Make sure to change the value of the `voterId` constant in line 24 of the script [2_ballot_casteVote](scripts/2_ballot_casteVote.js) incrementally each time you run this script:

```shell
npx hardhat run scripts/2_ballot_casteVote.js --network localhost
```