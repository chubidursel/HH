import { ethers } from "hardhat";


// npx hardhat clean && npx hardhat compile
// npx hardhat run --network goerli scripts/LayerZero/doEth.ts

// ETH -> 0x21Ab01f3753638Dd00234dc15F0E854A9405b501
// Arbitrum -> 0xaEF0b5C36BD8Ac88b424a3810cC8E1EB5350B25A

  // Arbitrum -> chainId: 10143   endpoint: 0x6aB5Ae6822647046626e83ee6dB8187151E1d5ab
  // GOERLI -> chainId: 10121   endpoint: 0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23

async function main() {
  console.log("Starting 🏃")

  const LayerZeroDemo1 = await ethers.getContractFactory("LayerZeroDemo1");
  const layerZeroDemo1 = await LayerZeroDemo1.attach(
    "0x21Ab01f3753638Dd00234dc15F0E854A9405b501"
  );

  const fees = await layerZeroDemo1.estimateFees(
    10143,
    "0xaEF0b5C36BD8Ac88b424a3810cC8E1EB5350B25A",
    ethers.utils.formatBytes32String("Shalom from ETH-Goerli"),
    false,
    []
  );
  console.log("Fee to pay: ", ethers.utils.formatEther(fees[0].toString()));


console.log("PAYLOAD: ", ethers.utils.formatBytes32String("Shalom from ETH-Goerli"))
console.log("Destination: ", ethers.utils.hexZeroPad("0xaEF0b5C36BD8Ac88b424a3810cC8E1EB5350B25A", 32))

  const tx = await layerZeroDemo1.sendMsg(
    10143,
    "0xaEF0b5C36BD8Ac88b424a3810cC8E1EB5350B25A",
    // ethers.utils.hexZeroPad("0xaEF0b5C36BD8Ac88b424a3810cC8E1EB5350B25A", 32),
    ethers.utils.formatBytes32String("Shalom from ETH-Goerli"),
    { value: ethers.utils.parseEther("0.1") }
  );
  console.log("TX: ", tx)

  console.log(`🏁 FINISHED 🏁`);
}

 
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});



// Article -> https://medium.com/@Tim4l1f3/layerzero-tutorial-for-beginners-d3fe9326e8b7
// https://goerli.etherscan.io/address/0x21Ab01f3753638Dd00234dc15F0E854A9405b501
// https://testnet.arbiscan.io/address/0xaEF0b5C36BD8Ac88b424a3810cC8E1EB5350B25A

// Guy from utube -> https://jamesbachini.com/layerzero-example/
