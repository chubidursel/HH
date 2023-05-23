import { ethers } from "hardhat";

// npx hardhat clean && npx hardhat compile
// npx hardhat run --network goerli scripts/LayerZero/checkEth.ts

// ETH -> 0x21Ab01f3753638Dd00234dc15F0E854A9405b501
// Arbitrum -> 0xaEF0b5C36BD8Ac88b424a3810cC8E1EB5350B25A
async function main() {
  console.log("Starting 🏃")

  const LayerZeroDemo1 = await ethers.getContractFactory("LayerZeroDemo1");
  const layerZeroDemo1 = await LayerZeroDemo1.attach(
    "0x21Ab01f3753638Dd00234dc15F0E854A9405b501"
  );
  const count = await layerZeroDemo1.messageCount();
  const msg = await layerZeroDemo1.message();
  console.log('Count: ', count);
  console.log('Message: ', ethers.utils.toUtf8String(msg));

  console.log(`🏁 FINISHED 🏁`);
}

 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
