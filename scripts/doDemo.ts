import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run --network goerli scripts/doDemo.ts
  //const defaultProvider = new ethers.providers.InfuraProvider("goerli");

async function main() {
  console.log("Starting 🏃")

  const newNumber = 15;

  const [deployer] = await ethers.getSigners();
  console.log("👷 Account: ", deployer.address)
  const bal =  await deployer.getBalance()
  console.log("👷 Account Balance: ", bal.toString())

  const contract = await ethers.getContractAt("Demo", '0x2D63E91B3f70ca00F892874B114d173718a78643')

  const gasPrice = await deployer.getGasPrice()
  console.log("📄 getGasPrice(): ", gasPrice)

  // const dataGasFee = await ethers.provider.getFeeData();
  // console.log("📄 getFeeData(): ", dataGasFee)

  const gasLimit = await contract.estimateGas.setNum(newNumber)
  console.log("📄 estimateGas.setNum(77): ", gasLimit)

  const amountOfEthToPay = gasPrice.mul(gasLimit);
  console.log("📄🦊 transactionFee in wei: " + amountOfEthToPay.toString());
  console.log("📄🦊 transactionFee in ether: " + ethers.utils.formatUnits(amountOfEthToPay, "ether"));


  const res = await contract.num();
  console.log("Num: ", res)

  //const options = { gasPrice: 1000000000, gasLimit: 85000, nonce: 45, value: 0 }
  const options = {gasPrice: gasPrice, gasLimit: gasLimit}
  const tx = await contract.setNum(newNumber, options); // 1st => 43768
  console.log("📈 TX1: ", tx);

  const txres = await tx.wait();
  console.log("📈 TX after wait(): ", txres)

  const res2 = await contract.num();
  console.log("NUm: ", res2)

  console.log("👷 WEI spent: ", (await deployer.getBalance()).sub(bal))
  console.log("👷 ETH spent: ", ethers.utils.formatUnits(((await deployer.getBalance()).sub(bal)), "ether") )

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