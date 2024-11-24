import {
  Account, Aptos, AptosConfig, Network, Ed25519PrivateKey,
  AccountAddress,
} from "@aptos-labs/ts-sdk";

const network = Network.LOCAL;
const config = new AptosConfig({ network });
const client = new Aptos(config);

// nft 소유자
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
  const das = await client.getOwnedDigitalAssets({ ownerAddress: signer.accountAddress });
  
  console.log(das);

  // SBT는 transfer 할 수 없다.
  const transaction = await client.transaction.build.simple({
      sender: signer.accountAddress,
      withFeePayer: true,
      data: {
          function: "0x1::object::transfer",
          typeArguments: ['0x4::token::Token'],
          functionArguments: [
              AccountAddress.from(das[0].token_data_id), 
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