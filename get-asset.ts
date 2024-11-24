import {
  AccountAddress,
  Aptos, AptosConfig, Network
} from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

async function main() {
  const ownerAddress = AccountAddress.from('');;

  const das = await client.getOwnedDigitalAssets({ ownerAddress });
  
  das.forEach(da => {
      console.log(da)
  })

}

main();