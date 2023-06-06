import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run --network mumbai scripts/LayerZero/deployMedium.ts
// npx hardhat run --network goerli scripts/LayerZero/deployMedium.ts
 // npx hardhat verify --network mumbai 0x061C9f4e28175BA70f5fc62a885820973E92f0b8 0xf69186dfBa60DdB133E91E9A4B5673624293d8F8  👳

// NFT on Goerli -> 0xF0A56bd96E57502c9b5854cE9C2410b1FF2e7507
// NFT on Mumbai -> 0xf578cf84Fca2bc09BAB7C3a280101B7cA3BD15ea

// const c = await ethers.getContractAt("OmniChainNFT", '0xF0A56bd96E57502c9b5854cE9C2410b1FF2e7507') 
// --------- DEPLOY -------------
// async function main() {
//   console.log("Starting 🏃")

//   const contractName = "OmniChainNFT"

//   const Demo = await ethers.getContractFactory(contractName);

//     const [deployer] = await ethers.getSigners();
//     console.log("👷 Account: ", deployer.address)
//     const gasPrice = await deployer.getGasPrice()
//     console.log("📄 getGasPrice(): ", gasPrice)
   
// // POLYGON -> "0xf69186dfBa60DdB133E91E9A4B5673624293d8F8" || chainId: 10109
// // GOERLI -> 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23
//   const demo = await Demo.deploy("0xf69186dfBa60DdB133E91E9A4B5673624293d8F8", 0, 100)
  
//   const tx = await demo.deployed();

//   const transaction = await demo.deployTransaction.wait();
//   const gasUsed = transaction.gasUsed;


//   console.log('$$$$ Gas used:', gasUsed.toString());
//   const transactionCost = gasUsed.mul(gasPrice);
//   console.log("Transaction cost in Ether:", ethers.utils.formatEther(transactionCost));

//   console.log('SC ADDRESS -> ', demo.address);
//   console.log(`🏁 FINISHED 🏁`);
// }

// --------- MINT / CROSS_CHAIN -------------
async function main() {
  console.log("Starting 🏃")

  const account = "0x777b951C8071Da05A227fE032C94C25421Ec7777";
  const OmniChainNFT = await ethers.getContractFactory("OmniChainNFT");
  const omniChainNFT = await OmniChainNFT.attach(
    "0xF0A56bd96E57502c9b5854cE9C2410b1FF2e7507"
  );
  // ######### MINT #########
//  const tx = await omniChainNFT.mint();
//  const res = await tx.wait()
// console.log("Minted: ", res)
  // const balance = await omniChainNFT.balanceOf(account);
  // console.log("NFT balance: ", balance.toString());
  // const owner = await omniChainNFT.ownerOf(1);
  // console.log("Token 1 owner: ", owner);

    // ######### cross chain #########

    const txCC = await omniChainNFT.crossChain(
      10109,
      "0xf578cf84Fca2bc09BAB7C3a280101B7cA3BD15ea",
      ethers.BigNumber.from("1"),
      { value: ethers.utils.parseEther("1") }
    );

    const res = await txCC.wait()
    console.log(res)

  
  console.log(`🏁 FINISHED 🏁`);
}
 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


