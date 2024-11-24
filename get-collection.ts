import {
  Aptos, AptosConfig, Network, AccountAddress,
} from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

async function main() {
  const creatorAddress = AccountAddress.from('');;

  const collection = await client.getCollectionDataByCreatorAddressAndCollectionName({
      creatorAddress: creatorAddress,
      collectionName: 'Mung-Collection'
  });

  console.log(collection);
  
  const collection0 = await client.getCollectionDataByCreatorAddress({
      creatorAddress: creatorAddress,
  });

  console.log(collection0);
}

main();