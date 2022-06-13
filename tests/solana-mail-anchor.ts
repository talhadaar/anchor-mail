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

const WELCOME_MESSAGE = "Welcome to SolMail";

describe("solana-mail-anchor", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolanaMailAnchor as Program<SolanaMailAnchor>;
  const programProvider = program.provider as anchor.AnchorProvider;

  let mailAccount1 = anchor.web3.Keypair.generate();
  // let mailAccount1BumpSeed = null;

  let mailAccount2 = anchor.web3.Keypair.generate();
  // let mailAccount2BumpSeed = null;

  it("Mail Account 1 & 2 initialized!", async () => {
    // [mailAccount1, mailAccount1BumpSeed] = await generateMailAccountPda(program.programId, sender1);
    await program.methods.initializeAccount()
      .accounts({
        owner: programProvider.wallet.publicKey,
        mailAccount: mailAccount1.publicKey
      })
      .signers([mailAccount1])
      .rpc();
    await program.methods.initializeAccount()
      .accounts({
        owner: programProvider.wallet.publicKey,
        mailAccount: mailAccount2.publicKey
      })
      .signers([mailAccount2])
      .rpc();

    let data = await program.account.mailAccount.fetch(mailAccount1.publicKey);
    expect(data.sent[0].subject).to.equal(WELCOME_MESSAGE);
    data = await program.account.mailAccount.fetch(mailAccount2.publicKey);
    console.log(data);
    expect(data.sent[0].subject).to.equal(WELCOME_MESSAGE);
    console.log(data);
  });

  it("Account 1 mails account 2", async () => {
    let mail = {
      id: 'l1s19bscs0060',
      fromAddress: mailAccount1.publicKey.toBase58(),
      toAddress: mailAccount2.publicKey.toBase58(),
      subject: 'Hello there.',
      body: 'GENERAL KENOBO???\n' +
        '            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos ut labore, debitis assumenda, dolorem nulla facere soluta exercitationem excepturi provident ipsam reprehenderit repellat quisquam corrupti commodi fugiat iusto quae voluptates!',
      sentDate: '13/6/2022, 3:58:02 PM'
    };
    await program.methods.sendEmail(mail).accounts({
      sender: mailAccount1.publicKey,
      receiver: mailAccount2.publicKey
    })
    .signers([])
    .rpc();

    let data = await program.account.mailAccount.fetch(mailAccount1.publicKey);
    expect(data.sent[1].subject).to.equal(mail.subject);
    data = await program.account.mailAccount.fetch(mailAccount2.publicKey);
    console.log(data);
    expect(data.inbox[0].subject).to.equal(mail.subject);
    console.log(data);
  });
});
