import { ethers } from 'ethers'
import { getMulticallAddress, getRouterAddress } from './addressHelpers'

import MultiCallAbi from '@/config/abi/Multicall.json'
import PancakeRouterAbi from '@/config/abi/PancakeRouter.json'
import Erc20Abi from '@/config/abi/Erc20.json'
import Erc721Abi from '@/config/abi/Erc721.json'


const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    return new ethers.Contract(address, abi, signer)
}

export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(MultiCallAbi, getMulticallAddress(), signer)
}

export const getRouterContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(PancakeRouterAbi, getRouterAddress(), signer);
}

export const getTokenContract = (tokenAddress: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(Erc20Abi, tokenAddress, signer);
}

export const getNFTContract = (nftAddress: string, signer?: ethers.Signer | ethers.providers.Provider) => {
    return getContract(Erc721Abi, nftAddress, signer);
}