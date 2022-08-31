import { Address } from "@/typings/base";
import { Amount } from "@/typings/swap";
import { ethers } from "ethers";
import { getRouterContract } from "./contractHelpers";


class SwapHelper {
    signer: ethers.Signer;
    routerContract: ethers.Contract;

    constructor(signer: ethers.Signer) {
        this.signer = signer;
        this.routerContract = getRouterContract(signer);

    }

    async getAmountOutMinBySil(amountIn: Amount, paths: Address[], _slippage: number) {
        const amountOutMin = await this.routerContract.getAmountsOut(amountIn, paths);
        return amountOutMin[paths.length - 1].sub(amountOutMin[paths.length - 1].mul(_slippage).div(1000))
    }

    async getAmountOutMin(amountIn: Amount, paths: Address[]) {
        return await this.routerContract.getAmountsOut(amountIn, paths);
    }

    async getSlippage(amountIn: Amount, paths: Address[]) {
        const amountOutMin = await this.routerContract.getAmountsOut(amountIn, paths);
        // const realAmountOut = await this.routerContract.callStatic.swa
    }
}