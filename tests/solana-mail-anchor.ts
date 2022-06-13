import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { expect } from "chai";
import { SolanaMailAnchor } from "../target/types/solana_mail_anchor";

async function generateMailAccountPda(programId: anchor.web3.PublicKey, owner: anchor.web3.PublicKey): Promise<[anchor.web3.PublicKey, number]> {
  let seeds = [
    owner.toBytes(),
    anchor.utils.bytes.utf8.encode("anchor_mail_account")
  ];
  return await anchor.web3.PublicKey.findProgramAddress(seeds, programId);
}

describe("solana-mail-anchor", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaMailAnchor as Program<SolanaMailAnchor>;
  const programProvider = program.provider as anchor.AnchorProvider;
  
  const wallet1 = programProvider.wallet;
  const sender1 = programProvider.wallet.publicKey;

  const sender2Keypair = anchor.web3.Keypair.generate();
  const sender2 = sender2Keypair.publicKey;
  const wallet2 = new anchor.Wallet(sender2Keypair);
  const provider2 = new anchor.AnchorProvider(program.provider.connection, wallet2, {});

  let mailAccount1 = null;
  let mailAccount1BumpSeed = null;

  let mailAccount2 = null;
  let mailAccount2BumpSeed = null;

  it("Mail Account1 initialized!", async () => {
    [mailAccount1, mailAccount1BumpSeed] = await generateMailAccountPda(program.programId, sender1);

    await program.methods.initializeAccount()
      .accounts({
        owner: sender1,
        mailAccount: mailAccount1
      })
      .signers([])
      .rpc();
    let mailAccount1Data = await program.account.mailAccount.fetch(mailAccount1);
    expect(mailAccount1Data.bumpSeed).to.equal(mailAccount1BumpSeed);
    console.log(mailAccount1Data);
  });

  it("Mail Account2 initialized", async ()=>{
    // let ix = anchor.web3.SystemProgram.createAccount({
    //   fromPubkey: ,
    //   newAccountPubkey: sender2,
    //   programId: program.programId,
    //   space: 1,
    //   lamports: anchor.web3.LAMPORTS_PER_SOL * 100
    // });
    // let tx = new anchor.web3.Transaction().add(ix);
    // let txSig = await program.provider.sendAndConfirm(tx, [sender2Keypair]);
    // console.log("Sender2 account created ", txSig);

  //   await program.provider.connection.requestAirdrop(wallet2.publicKey, anchor.web3.LAMPORTS_PER_SOL * 1000);
  //   [mailAccount2, mailAccount2BumpSeed] = await generateMailAccountPda(program.programId, wall);
  //   await program.methods.initializeAccount()
  //     .accounts({
  //       owner: wallet2.publicKey,
  //       mailAccount: mailAccount2
  //     })
  //     .signers([sender2Keypair])
  //     .rpc();

  //   let mailAccount2Data = await program.account.mailAccount.fetch(mailAccount2);
  //   expect(mailAccount2Data.bumpSeed).to.equal(mailAccount2BumpSeed);
  //   console.log(mailAccount2Data);
  });
});
