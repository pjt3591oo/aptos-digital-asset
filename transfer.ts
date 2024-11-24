import {
  Account, Aptos, AptosConfig, Network, Ed25519PrivateKey,
  AccountAddress,
} from "@aptos-labs/ts-sdk";

const network = Network.TESTNET;
const config = new AptosConfig({ network });
const client = new Aptos(config);

// DA 소유자
const signer = Account.fromPrivateKey({
  privateKey: new Ed25519PrivateKey('')
});

// 토큰 수신자
const recipient = AccountAddress.from('')

async function main() {

  const das = await client.getOwnedDigitalAssets({ ownerAddress: signer.accountAddress });
  const avaliableDas = das.filter(da => !da.is_soulbound_v2);

  if (avaliableDas.length === 0) {
    console.log('No digital assets found');
    return;
  }

  // SBT는 transfer 할 수 없다.
  const transaction = await client.transaction.build.simple({
      sender: signer.accountAddress,
      data: {
          function: "0x1::object::transfer",
          typeArguments: ['0x4::token::Token'],
          functionArguments: [
              AccountAddress.from(avaliableDas[0].token_data_id), 
              recipient
          ],
        },
  });

  const pendingTxn = await client.signAndSubmitTransaction({
      signer,
      transaction,
  });
  const response = await client.waitForTransaction({ transactionHash: pendingTxn.hash });
  console.log(response);
}

main();