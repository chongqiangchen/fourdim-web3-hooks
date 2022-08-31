import { providers } from "ethers";
import { useEffect, useRef } from "react";

interface BlockIntervalOptions {
    provider: providers.BaseProvider;
    delayBlock?: number;
    leading?: boolean;
}

const blockEvent = (provider: providers.BaseProvider, callback: Function, delayBlock: number) => {
    let blockRunning = 0;

    const fn = (block: number) => {
        blockRunning += 1;

        if (blockRunning >= delayBlock) {
            callback && callback(block);
            blockRunning = 0;
        }
    };

    provider.on('block', fn);

    return fn;
}

const useBlockInterval = 
(
    callback: Function,
    { provider, delayBlock = 1, leading = true }: BlockIntervalOptions, 
    deps: any[] = []
) => {
    const savedCallback = useRef<Function>()

    useEffect(() => {
        savedCallback.current = callback
    }, [callback])

    useEffect(() => {
        function tick(e?: number) {
            const { current } = savedCallback
            if (current) {
                current(e)
            }
        }

        if (delayBlock !== null && provider) {
            if (leading) tick(provider.blockNumber);
            const fn = blockEvent(provider, tick, delayBlock);
            return () => {
                provider.off('block', fn);
            };
        }
        return undefined
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, delayBlock, leading, ...deps])
}

export default useBlockInterval;
