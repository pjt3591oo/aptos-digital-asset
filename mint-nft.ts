import {
  Account, Aptos, AptosConfig, Network, Ed25519PrivateKey, MoveVector,
} from "@aptos-labs/ts-sdk";

import {
  getPropertyValueRaw,
} from "aptos";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);


const signer = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('')
});

export function u256ToBigInt(u256Hex: string): number {
  if (u256Hex.length < 2) {
    return 0;
  }

  const first4Bytes = u256Hex.slice(2);
  
  if (first4Bytes.length === 0) {
    return 0;
  }
  
  const reversedBytes = first4Bytes.match(/../g)?.reverse().join('');
  const result = BigInt("0x" + reversedBytes);
  return Number(result);
}

async function main() {
  const collectionName = 'Mung-Collection';
  const description = 'nft-desc0';
  const name = `nft-name0 ${new Date().getTime()}`;
  const uri = 'nft-uri0';

  /*
  // PropertyValue::type
  const BOOL: u8 = 0;
  const U8: u8 = 1;
  const U16: u8 = 2;
  const U32: u8 = 3;
  const U64: u8 = 4;
  const U128: u8 = 5;
  const U256: u8 = 6;
  const ADDRESS: u8 = 7;
  const BYTE_VECTOR: u8 = 8;
  const STRING: u8 = 9; // 0x1::string::String

  const PropertyTypeMap = {
      BOOLEAN: "bool",
      U8: "u8",
      U16: "u16",
      U32: "u32",
      U64: "u64",
      U128: "u128",
      U256: "u256",
      ADDRESS: "address",
      STRING: "0x1::string::String",
      ARRAY: "vector<u8>",
  };
  */
 
  const propertyKeys = ["column0", "column1"];
  const propertyTypes = ["u256", "0x1::string::String"];  // All types are now "string"
  const propertyValues = ["1234", "asdf"];  // All values are strings
  
  const movePropertyKeys = MoveVector.MoveString(propertyKeys);
  const movePropertyTypes = MoveVector.MoveString(propertyTypes);
  const movePropertyValues = getPropertyValueRaw(propertyValues, propertyTypes);
  
  // hexString to U256
  // console.log(MoveVector.U256([1]));
  // const hexString= new U256(112341234n).bcsToHex().toString();
  // console.log(u256ToBigInt(hexString));

  const transaction = await client.transaction.build.simple({
      sender: signer.accountAddress,
      data: {
          function: `0x4::aptos_token::mint`,
          functionArguments: [
              collectionName,
              description,
              name,
              uri,
              movePropertyKeys,
              movePropertyTypes,
              movePropertyValues,
          ],
      },
  });

  const pendingTxn = await client.signAndSubmitTransaction({
      signer,
      transaction,
  });

  const rst = await client.waitForTransaction({ transactionHash: pendingTxn.hash });
  console.log(rst);
}

main();