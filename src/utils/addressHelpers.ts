import { Address } from '@/typings/base';
import addresses from '@/config/constants/contracts';
import getChainId from './chainId';

export const getAddress = (address: Address): string => {
  const chainId = getChainId();
  return address[chainId];
};

export const getMulticallAddress = () => {
  return getAddress(addresses.multiCall);
};

export const getRouterAddress = () => {
  return getAddress(addresses.pancakeRouter);
};
