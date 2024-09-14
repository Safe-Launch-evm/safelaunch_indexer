import { TokenInfo, TokenSwap } from "../types";
import { TokenSwappedLog } from "../types/abi-interfaces/SafelaunchAbi";
import { TokenCreatedLog } from "../types/abi-interfaces/TokenfactoryAbi";
import assert from "assert";

export async function handleTokenCreationLog(
  log: TokenCreatedLog
): Promise<void> {
  logger.info(`New TokenCreated event log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const token = TokenInfo.create({
    id: log.transactionHash,
    tokenAddress: log.args.tokenAddress,
    owner: log.args.deployer,
    name: log.args.tokenName,
    symbol: log.args.tokenSymbol,
  });

  await token.save();
 }

export async function handleTokenSwapLog(log: TokenSwappedLog): Promise<void> {
  logger.info(`New TokenSwap event log at block ${log.blockNumber}`);
  assert(log.args, "No log.args");

  const token = TokenSwap.create({
    id: log.transactionHash,
    token: log.args.token,
    txnType: log.args.txnType,
    amount: log.args.amount.toBigInt(),
    fee: log.args.fee,
    timestamp: log.args.timestamp.toBigInt(),
    user: log.args.user,
  });

  await token.save();
}