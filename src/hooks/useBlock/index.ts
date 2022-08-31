import { BigNumber } from "ethers";
import useBlockInterval from "@/hooks/useBlockInterval";
import { useMemo, useState } from "react";
import getBlockNumberTimestamp from "@/utils/blockTimestamp";
import { getJsonRpcProvider } from "@/utils/providers";

const useBlock = () => {
    const provider = useMemo(() => getJsonRpcProvider(), []);
    const [blockNumber, setBlockNumber] = useState<number>(-1);
    const [blockTimestamp, setBlockTimestamp] = useState<BigNumber>(BigNumber.from(-1));

    useBlockInterval((e: number) => {
        (async () => {
            const blockTimestamp = await getBlockNumberTimestamp(provider);
            setBlockNumber(e);
            setBlockTimestamp(blockTimestamp);
        })()
    }, {provider})

    return {blockNumber, blockTimestamp};
}

export default useBlock;