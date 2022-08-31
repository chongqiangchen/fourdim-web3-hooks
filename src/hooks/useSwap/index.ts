import { useEffect, useRef, useState } from "react";
import { Contract, ethers } from "ethers";
import { callWithEstimateGas } from "@/utils/estimateGas";
import { getRouterContract } from "@/utils/contractHelpers";
import { Address } from "@/typings/base";
import { Amount, SwapCallOptions } from "@/typings/swap";
import Token from "@/utils/token";
import { getRouterAddress } from "@/utils/addressHelpers";
import { SWAP_NO_BALANCE } from "@/config/constants/error";
import usePersistFn from "../usePersistFn";
import useTransactionDeadline from "../useTransactionDeadline";

const useSwap = (
    signer: ethers.Signer | ethers.Wallet,
    { allowedSlippage = 5 } = {}
) => {
    const routerContract = useRef<Contract>();
    const [swapLoading, setSwapLoading] = useState(false);
    const deadline = useTransactionDeadline(400);

    useEffect(() => {
        if (signer) {
            routerContract.current = getRouterContract(signer);
        }
    }, [signer])

    const getAmountOutMinBySil = async (amountIn: Amount, paths: Address[], _slippage: number) => {
        const amountOutMin = await routerContract.current!.getAmountsOut(amountIn, paths);
        return amountOutMin[paths.length - 1].sub(amountOutMin[paths.length - 1].mul(_slippage).div(1000))
    }

    const getAmountOutMin = async (amountIn: Amount, paths: Address[]) => {
        return await routerContract.current!.getAmountsOut(amountIn, paths);
    }

    const approveRouter = async (tokenAddress: string, allowanceAmount = ethers.constants.MaxUint256) => {
        const token = new Token(tokenAddress, signer);
        const routerAddress = getRouterAddress();
        const allowance = await token.allowance(routerAddress);

        if (Number(allowance) <= 0) {
            const tx = await token.approve(routerAddress, allowanceAmount);
            await tx.wait();
        }
    }

    const swapExactTokensForTokensSupportingFeeOnTransferTokens = 
    async (
        paths: string[], 
        amountIn: Amount,
        { slippage, toAddress }: SwapCallOptions = {}
    ) => {
        const { current } = routerContract;
        const token = new Token(paths[0], signer);
        const balance = await token.balance();
        const signerAddress = await signer.getAddress();

        setSwapLoading(true);

        if (Number(balance) <= Number(amountIn)) {
            throw Error(SWAP_NO_BALANCE);
        }

        await approveRouter(paths[0]);

        const amountOutMinBySli = await getAmountOutMinBySil(amountIn, paths, slippage || allowedSlippage);

        const tx = await callWithEstimateGas(current, 'swapExactTokensForTokensSupportingFeeOnTransferTokens', [
            amountIn,
            amountOutMinBySli,
            paths,
            toAddress || signerAddress,
            deadline,
        ]);

        tx && await tx.wait();
        setSwapLoading(false)
        return tx;
    }

    return {
        swapLoading,
        swapExactTokensForTokensSupportingFeeOnTransferTokens,
        getAmountOutMinBySil: usePersistFn(getAmountOutMinBySil),
        getAmountOutMin: usePersistFn(getAmountOutMin),
        routerContract: routerContract.current,
    }
}

export default useSwap;
