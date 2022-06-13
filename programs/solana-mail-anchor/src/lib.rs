use anchor_lang::prelude::*;
pub mod state;
use state::{Mail, MailAccount};

declare_id!("DsKeiZjVAnaUY8uNcEeqh5jsz8tRXvU29uoMkiewF1Hg");
pub const MAIL_ACCOUNT_DISCRIMINATOR: &str = "anchor_mail_account";

#[program]
pub mod solana_mail_anchor {
    use super::*;

    pub fn initialize_account(ctx: Context<InitAccount>) -> Result<()> {
        let welcome_mail = Mail {
            id: String::from("00000000-0000-0000-0000-000000000000"),
            from_address: ctx.program_id.to_string(),
            to_address: ctx.accounts.owner.key().to_string(),
            subject: String::from("Welcome to SolMail"),
            body: String::from("This is the start of your private messages on SolMail
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quos ut labore, debitis assumenda, dolorem nulla facere soluta exercitationem excepturi provident ipsam reprehenderit repellat quisquam corrupti commodi fugiat iusto quae voluptates!"),
            sent_date: String::from("9/29/2021, 3:58:02 PM"),
          };
        ctx.accounts.mail_account.sent.push(welcome_mail);
        // ctx.accounts.mail_account.bump_seed = *ctx.bumps.get("mail_account").unwrap();
        Ok(())
    }

    pub fn send_email(ctx: Context<SendEmail>) -> Result<()> {
        Ok(())
    }
}

// TODO create new provider to pay for transaction - it fails with errors that keep changing?????
// #[account(init,payer = owner, space = 10240, seeds = [owner.key.as_ref(), MAIL_ACCOUNT_DISCRIMINATOR.as_bytes()], bump)]

#[derive(Accounts)]
pub struct InitAccount<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    // Occupy all 10MB of account storage space
    #[account(init,payer = owner, space = 10240)]
    pub mail_account: Account<'info, MailAccount>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SendEmail {}
