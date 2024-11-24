import {
  Account, Aptos, AptosConfig, Network, Ed25519PrivateKey,
  MoveVector,
} from "@aptos-labs/ts-sdk";

import {
  getPropertyValueRaw,
} from "aptos";

const network = Network.LOCAL;
const config = new AptosConfig({ network });
const client = new Aptos(config);

// collection 소유자
const signer = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('')
});

// 수수료 납부자
const feePayerAccountAddressPrivatekey = '';
const feePayerAccount = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey(feePayerAccountAddressPrivatekey)
});

// 토큰 수신자
const recipient = '';

const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {
  const collectionName = 'name';
  const description = 'sbt-desc1';
  const name = 'sbt-name1';
  const uri = 'sbt-uri1';

  const transaction = await client.transaction.build.simple({
      sender: signer.accountAddress,
      withFeePayer: true,
      data: {
          function: `0x4::aptos_token::mint_soul_bound`,
          functionArguments: [
              collectionName,
              description,
              name,
              uri,
              MoveVector.MoveString([]),
              MoveVector.MoveString([]),
              getPropertyValueRaw([], []),
              recipient
          ],
      },
  });

  const senderSignature = await client.transaction.sign({
      signer: signer,
      transaction,
  });
  const sponsorSignature = await client.transaction.signAsFeePayer({
      signer: feePayerAccount,
      transaction,
  });
  const pendingTxn = await client.transaction.submit.simple({
      transaction,
      senderAuthenticator: senderSignature,
      feePayerAuthenticator: sponsorSignature,
  });
  const committed = await client.waitForTransaction({
      transactionHash: pendingTxn.hash,
  });
  await timer(500);
  console.log(committed);
}

main();