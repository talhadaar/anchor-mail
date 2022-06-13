use anchor_lang::prelude::*;

#[error_code]
pub enum MailError {
  /// Invalid Instruction
  #[error("Invalid Instruction")]
  InvalidInstruction,
  /// Account Is Not Writable
  #[error("Account Is Not Writable")]
  NotWritable,
}