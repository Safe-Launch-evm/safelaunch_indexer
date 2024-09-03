import { TokenInfo } from "../types";
import { TokenCreatedLog } from "../types/abi-interfaces/SafelaunchAbi";
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
    name: log.args.tokenname,
    symbol: log.args.tokensymbol,
  });

  await token.save();
}
