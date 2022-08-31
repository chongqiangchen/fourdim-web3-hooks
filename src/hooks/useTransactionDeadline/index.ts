import { BigNumber } from 'ethers'
import { useMemo } from 'react'
import useBlock from '@/hooks/useBlock'

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export default function useTransactionDeadline(ttl: number): BigNumber | undefined {
  const {blockTimestamp} = useBlock();

  return useMemo(() => {
    if (blockTimestamp && ttl) return blockTimestamp.add(ttl)
    return undefined
  }, [blockTimestamp, ttl])
}
