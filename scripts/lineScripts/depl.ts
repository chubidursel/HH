import { ethers, run } from "hardhat";

// npx hardhat run --network goerli scripts/lineScripts/depl.ts

async function main() {
  console.log("Start Deploying....")

  const [deployer] = await ethers.getSigners();

  const Contract = await ethers.getContractFactory("Apply");
  const contract = await Contract.deploy();

  const contractDeployed = await contract.deployed();

  console.log("👨 The owner of smart contract is: ", deployer.address);
  console.log(`🔥 SC Deployed! Address: ${contract.address}`);

  await contractDeployed.deployTransaction.wait(5)
  console.log("✅ Verifying smart contract...")
  
  await run("verify:verify", {
      address: contract.address
  })
  console.log("DONE!")
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});