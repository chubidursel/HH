import { providers } from "ethers";
import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run scripts/testWallet.ts

async function main() {
  console.log("Starting 🏃")

  const [deployer, acc1, acc2, acc3, acc4, acc5, acc6, admin] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("ZkEasyWallet");
  const contractWallet = await Contract.deploy([acc1.address, acc2.address, acc3.address], [20, 30, 50]);

  await contractWallet.deployed();

  console.log("✅ All Contracts has been deployed!")


  console.log()
  console.log("💥💥💥💥 TEST #2 Add User 💥💥💥💥 ")

  await deployer.sendTransaction({
    to: contractWallet.address,
    value: 100
  });

  // console.log("📄Total shares: ", await contractWallet.totalShares())
  // console.log("📄Total released: ", await contractWallet.totalReleased())
  console.log("📄user #1 INFO: ", (await contractWallet.users(acc1.address)))
  console.log("📦 SC balance:  ", await contractWallet.getBalanceETH())
  console.log("👨 User releasable:  ", await contractWallet.releasable(acc1.address))

  await contractWallet.connect(acc1).release();
  console.log("✅ RELEASED!!!")

  console.log("#############  PROB  ###############")
  console.log("📦 SC balance:  ", await contractWallet.getBalanceETH())
  console.log("📦 Total release:  ", await contractWallet.totalReleased())
  console.log("👨 User releasable:  ", await contractWallet.releasable(acc1.address))


  await deployer.sendTransaction({
    to: contractWallet.address,
    value: 100
  });
  console.log("💸 + 100 WEI")
  
  console.log("👨 User releasable:  ", await contractWallet.releasable(acc1.address))
  console.log("👨 User2 releasable:  ", await contractWallet.releasable(acc2.address))
  
  
  await contractWallet.connect(acc1).release();

  console.log("📄user #1 INFO: ", (await contractWallet.users(acc1.address)))


  console.log()
  console.log("💥💥💥💥 TEST #2 Add user 💥💥💥💥 ")

  console.log("📦 Users Amount: ", await contractWallet.amountUsers())

  console.log("Active Proposal: ", await contractWallet.ACTIVE_VOTING())
  console.log("CounterID: ", await contractWallet.ProposalCounter())
  await contractWallet.connect(acc2).createProposal(acc4.address, true, 1, 10)

  console.log("✅ Proposal has been created! Status: ", await contractWallet.ACTIVE_VOTING())
  await contractWallet.connect(acc2).vote(1, true)
  console.log("✅ Voted! Status: ", await contractWallet.proposals(1))
  console.log("Quorum reached?: : ", await contractWallet.quorumReached(1))
  await contractWallet.connect(acc3).vote(1, true)
  console.log("✅ Voted! Status: ", await contractWallet.proposals(1))
  console.log("Quorum reached?: : ", await contractWallet.quorumReached(1))


  const blockTimestamp = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
  await ethers.provider.send("evm_mine", [blockTimestamp + 86400]); // <- 10 sec
  console.log("Wait 1 day ...")

  await contractWallet.connect(acc3).executeProposal(1);

  console.log("✅ EXECUTED! Status: ", await contractWallet.proposals(1))
  console.log("📦 Users Amount: ", await contractWallet.amountUsers())
  console.log("📦 Users Amount: ", await contractWallet.totalShares())


  console.log()
  console.log("💥💥💥💥 TEST #3 Delete User 💥💥💥💥 ")

  console.log("Active Proposal: ", await contractWallet.ACTIVE_VOTING())
  console.log("CounterID: ", await contractWallet.ProposalCounter())

  await contractWallet.connect(acc4).createProposal(acc4.address, false, 1, 0)

  console.log("✅ Proposal has been created! Status: ", await contractWallet.ACTIVE_VOTING(), await contractWallet.ProposalCounter())
  
// VOTING---------------------

await contractWallet.connect(acc2).vote(2, true)
//console.log("✅ Voted! Status: ", await contractWallet.proposals(2))
console.log("Quorum reached?: : ", await contractWallet.quorumReached(2))
await contractWallet.connect(acc3).vote(2, true)
//console.log("✅ Voted! Status: ", await contractWallet.proposals(2))
console.log("Quorum reached?: : ", await contractWallet.quorumReached(2))


const blockTimestamp2 = (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;
await ethers.provider.send("evm_mine", [blockTimestamp2 + 86400]); // <- 10 sec
console.log("Wait 1 day ...")

await contractWallet.connect(acc3).executeProposal(2);

console.log("✅ EXECUTED! Status: ", await contractWallet.proposals(2))
console.log("📦 Users Amount: ", await contractWallet.amountUsers())
console.log("📦 Users Amount: ", await contractWallet.totalShares())

  console.log(`🏁 FINISHED 🏁`);
}

 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


