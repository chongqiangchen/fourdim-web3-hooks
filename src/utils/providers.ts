import { ethers } from 'ethers';
import NETWORK_URLS from '@/config/constants/networks';
import getChainId from './chainId';

export const getJsonRpcProvider = (): ethers.providers.BaseProvider => {
  const chainId = getChainId();
  const networkRpc = NETWORK_URLS[chainId];
  return new ethers.providers.StaticJsonRpcProvider(networkRpc);
};
