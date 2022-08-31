import { TokenId } from "@/typings/nft";
import NFT from "@/utils/nft";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import usePersistFn from "../usePersistFn";

const useNFT = (address: string, signer: ethers.Signer, callWithStatus: Function) => {
    const [loading, setLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [name, setName] = useState('');
    const [totalSupply, setTotalSupply] = useState(0);

    const contract = useMemo(() => {
        return new NFT(address, signer);
    }, [])

    const _callWithStatus = usePersistFn(async (fn: Function, args?: any[]) => {
        if (callWithStatus) {
            return callWithStatus(fn, args);
        }

        setLoading(true);
        let result = null;
        try {
            result = await fn(...(args || []));
        } catch (error) {
            result = null;
        }
        setLoading(false);
        return result;
    })

    const getBalanceOf = usePersistFn(async (address: string) => {
        return _callWithStatus(contract.balanceOf, [address]);
    })

    const getBalance = usePersistFn(async () => {
        return _callWithStatus(contract.balance);
    })

    const approve = usePersistFn((to: string, tokenId: TokenId) => {
        return _callWithStatus(contract.approve, [to, tokenId])
    })

    const approveAll = usePersistFn((to: string, approved: boolean) => {
        return _callWithStatus(contract.approveAll, [to, approved])
    })

    const transferFrom = usePersistFn((from: string, to: string, tokenId: TokenId) => {
        return _callWithStatus(contract.transferFrom, [from, to, tokenId])
    })

    const transfer = usePersistFn((to: string, tokenId: TokenId) => {
        return _callWithStatus(contract.transfer, [to, tokenId])
    })

    const getTokenIds = usePersistFn(() => {
        return _callWithStatus(contract.getTokenIds)
    })

    const getInfo = usePersistFn((tokenId: string) => {
        return _callWithStatus(contract.getInfo, [tokenId]);
    })

    const getInfos = usePersistFn(() => {
        return _callWithStatus(contract.getInfos)
    })

    useEffect(() => {
        (async () => {
            const bln = await getBalance();
            const name = await contract.name();
            const total = await contract.totalSupply();
            setBalance(bln || 0);
            setName(name || '');
            setTotalSupply(total || 0);
        })()
    }, [contract, getBalance])

    return {
        contract,

        getBalance,
        getBalanceOf,
        approve,
        approveAll,
        transferFrom,
        transfer,
        getTokenIds,
        getInfo,
        getInfos,

        loading,
        initialBalance: balance,
        name,
        totalSupply,
    }
}

export default useNFT;