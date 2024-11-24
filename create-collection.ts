import {
  Account, Aptos, AptosConfig, Network, Ed25519PrivateKey,
  MoveString,
  Bool,
  U64,
} from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

const signer = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('')
});

async function main() {
  const description = 'Mung';
  const name = 'Mung-Collection';
  const uri = 'https://blog.naver.com/pjt3591oo';

  const transaction = await client.transaction.build.simple({
      sender: signer.accountAddress,
      data: {
          function: `0x4::aptos_token::create_collection`,
          functionArguments: [
              new MoveString(description),
              new U64(18446744073709551615n),
              new MoveString(name),
              new MoveString(uri),
              new Bool(true),
              new Bool(true),
              new Bool(true),
              new Bool(true),
              new Bool(true),
              new Bool(true),
              new Bool(true),
              new Bool(true),
              new Bool(true),
              new U64(0),
              new U64(1),
          ],
      },
  });

  const pendingTxn = await client.signAndSubmitTransaction({
      signer,
      transaction,
  });

  const rst = await client.waitForTransaction({transactionHash: pendingTxn.hash});
  console.log(rst);
}

main();