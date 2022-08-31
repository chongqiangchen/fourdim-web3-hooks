import { BigNumber } from "ethers";

export interface SwapCallOptions {
    slippage?: number;
    toAddress?: string;
}

export type Amount = number | string | BigNumber;