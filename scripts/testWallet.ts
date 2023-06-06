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
  console.log("💥💥💥💥 TEST #1 Withdraw Ether 💥💥💥💥 ")

  await deployer.sendTransaction({
    to: contractWallet.address,
    value: 100
  });

  console.log("📄Total shares: ", await contractWallet.totalShares())
  console.log("📄Total released: ", await contractWallet.totalReleased())
  console.log("📄user #1 share: ", (await contractWallet.users(acc1.address)).share)
  console.log("📄user #1 Releaed: ", (await contractWallet.users(acc1.address)).releasedAmount)

  await contractWallet.connect(acc1).release();
  console.log("📦 SC balance:  ", await contractWallet.getBalanceETH())
  console.log("👨 User releasable:  ", await contractWallet.releasable(acc1.address))

  await deployer.sendTransaction({
    to: contractWallet.address,
    value: 100
  });

  
  await contractWallet.connect(acc1).release();

  console.log("💸 WITHDRAW #2")
  console.log("📦 SC balance: ", await contractWallet.getBalanceETH())
  console.log("👨 User releasable:  ", await contractWallet.releasable(acc1.address))

  await deployer.sendTransaction({
    to: contractWallet.address,
    value: 100
  });

  
  await contractWallet.connect(acc1).release();

  console.log("💸 WITHDRAW #3")
  console.log("📦 SC balance: ", await contractWallet.getBalanceETH())
  console.log("👨 User releasable:  ", await contractWallet.releasable(acc1.address))


  console.log(`🏁 FINISHED 🏁`);
}

 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});





//---------------- USEFUL CODE --------------


 // function sleep(milliseconds : number) {
  //   const date = Date.now();
  //   let currentDate = null;
  //   do {
  //     currentDate = Date.now();
  //   } while (currentDate - date < milliseconds);
  // }
  // sleep(5000)

      //----------------- EVENTS --------------
// console.log("📢 EVENTS")
// //const eventsAll = await contract.queryFilter("*" as any, 0,  (await ethers.provider.getBlock(await ethers.provider.getBlockNumber())).timestamp;)
// const blockNumber = await ethers.provider.getBlockNumber();

// // Get all events from the contract from block 0 to the latest block
// const eventsAddEmployee = await contract.queryFilter(
//   contract.filters["AddEmployee(address,uint256)"](),
//   0,
//   blockNumber
// );
// console.log("Amount Evetns: ", eventsAddEmployee.length)


// const eventsStartStream = await contract.queryFilter(
//   contract.filters.StreamCreated(),
//   0,
//   blockNumber
// );

// console.log("Stream Created Evetns: ", eventsStartStream[0].args)

// // let eventFilterFinish = contract.filters["StreamFinished(address,uint256,uint256)"];
// // let eventsFinishStream = await contractFactory.queryFilter(eventFilterFinish);
// // console.log("📢 EVENTS FINISH: ", eventsFinishStream.length)


  //----------------- EVENTS --------------
// console.log("📢 EVENTS" ,  contract.filters.AddEmployee())
// contractUSDT.on("Transfer", (to, amount, from) => {
//   console.log("📢🟡 EVENTS", to, amount, from);
// });

//----------------- INFO --------------
// const info1 = await contract.totalAmountEmployee();
// const info2 = await contract.allEmployee(acc1.address);
// console.log("📄 INFO [ amount employee ] ➡️  ", info1.toString())
// console.log("📄 INFO [ info employee #1 ] ➡️  ", info2.flowRate)

// const infoToken1 = await contractUSDT.balanceOf(deployer.address);
// console.log("📄🟡 INFO [ Balance ] ➡️  ", infoToken1.toString())

// console.log("📄📕 INFO [ blocknumber ] ➡️  ",  await ethers.provider.getBlockNumber())
// console.log("📄📕 INFO [ acc1 = eth ] ➡️  ",  await ethers.provider.getBalance(deployer.address))
// console.log("📄📕 INFO [ gas price ] ➡️  ",  ethers.utils.formatEther(await ethers.provider.getGasPrice()), "gwei")


// ????????? CALCULATE token limit to add new Employee
// const totalAmountEmployees = (await contract.amountEmployee()).toNumber();
// const cRrate = (await contract.commonRateAllEmployee()).toNumber();
// const hoursLimit = (await contract.hoursLimitToAddNewEmployee()).toNumber();
// const res = (totalAmountEmployees + 1 ) * (cRrate + 10) * hoursLimit;
//     console.log(`📈 Calculation Math to add new employee:  ${totalAmountEmployees + 1} * ${cRrate + 10} * ${hoursLimit} = ${res} `)
// // ????????? CALCULATE token limit to Stream All 
//console.log("---------📈 BUFFER INFO 📈------------")
// const totalAmountEmployees2 = (await contract.amountEmployee()).toNumber();
// const cRrate2 = (await contract.commonRateAllEmployee()).toNumber();
// const hoursLimit2 = (await contract.hoursLimitToAddNewEmployee()).toNumber();
// const res2 = totalAmountEmployees2 * cRrate2 * hoursLimit2;

// const scBal2 = (await contract.balanceContract()).toNumber();
// console.log(`📈 Calculation Math to add new employee:  ${totalAmountEmployees2} * ${cRrate2} * ${hoursLimit2} = ${res2} `)
// console.log("📈Valid TO ADD // Balance: ", scBal2)
// console.log("📈 Can I add new Employee ", (scBal2 > res2))
// console.log("📈 Time different", (scBal2 - res2))