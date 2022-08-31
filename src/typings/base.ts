
export interface BSC_Address {
    56: string;
    97?: string;
}

export enum ChainIdKey {
    MAINNET = 'MAINNET',
    TESTNET = 'TESTNET',
}

export enum BSC_ChainId {
    MAINNET = 56,
    TESTNET = 97
}

export enum ETH_ChainId {
    MAINNET = 1,
    TESTNET = 2
}

export enum ChainType {
    BSC = 'BSC',
    ETH = 'ETH'
}

export type Address = {[key in number]: string};
export type ChainId = BSC_ChainId;