import { BSC_ChainId, ChainIdKey, ChainType, ETH_ChainId } from "@/typings/base";


const getChainId  = () => {
    const chainType: ChainType = process.env.REACT_APP_CHAIN_TYPE as ChainType || ChainType.BSC;
    const chainIdType: ChainIdKey = process.env.REACT_APP_CHAIN_ID_TYPE as ChainIdKey || ChainIdKey.MAINNET;

    switch (chainType) {
        case ChainType.BSC:
            return BSC_ChainId[chainIdType];
        case ChainType.ETH:
            return ETH_ChainId[chainIdType];
        default:
            return BSC_ChainId[chainIdType];
    }
}

export default getChainId;