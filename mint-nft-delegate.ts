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

const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

async function main() {

  const collectionName = 'name';
  const description = 'nft-desc2';
  const name = 'nft-name2';
  const uri = 'nft-uri2';

  const transaction = await client.transaction.build.simple({
      sender: signer.accountAddress,
      withFeePayer: true,
      data: {
          function: `0x4::aptos_token::mint`,
          functionArguments: [
              collectionName,
              description,
              name,
              uri,
              MoveVector.MoveString([]),
              MoveVector.MoveString([]),
              getPropertyValueRaw([], []),
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