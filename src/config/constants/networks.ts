import { ChainId, BSC_ChainId } from "@/typings/base"

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [BSC_ChainId.MAINNET]: 'https://bsc-dataseed1.defibit.io',
  [BSC_ChainId.TESTNET]: 'https://data-seed-prebsc-1-s1.binance.org:8545',
}

export default NETWORK_URLS
