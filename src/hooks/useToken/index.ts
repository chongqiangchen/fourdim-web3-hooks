import Token from '@/utils/token';
import { ethers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import usePersistFn from '../usePersistFn';

const useToken = (address: string, signer: ethers.Signer, callWithStatus: Function) => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [name, setName] = useState('');
  const [decimals, setDecimals] = useState(0);

  const contract = useMemo(() => {
    return new Token(address, signer);
  }, [address, signer]);

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
  });

  const getBalanceOf = usePersistFn(async (address: string) => {
    return _callWithStatus(contract.balanceOf, [address]);
  });

  const getBalance = usePersistFn(async () => {
    return _callWithStatus(contract.balance);
  });

  const approve = usePersistFn(async (approvedAddress: string, amount = ethers.constants.MaxUint256) => {
    return _callWithStatus(contract.approve, [approvedAddress, amount]);
  });

  const unApprove = usePersistFn(async (approvedAddress: string) => {
    return _callWithStatus(contract.approve, [approvedAddress, 0]);
  });

  const getAllowance = usePersistFn(async (approvedAddress: string) => {
    return _callWithStatus(contract.allowance, [approvedAddress]);
  })

  useEffect(() => {
    (async () => {
      const bln = await getBalance();
      const name = await contract.name();
      const decimals = await contract.decimals();
      setBalance(bln || 0);
      setName(name || '');
      setDecimals(decimals || 18);
    })();
  }, [contract, getBalance]);

  return {
    contract,

    getBalance,
    getBalanceOf,
    approve,
    unApprove,
    getAllowance,

    loading,
    initialBalance: balance,
    name,
    decimals,
  };
};

export default useToken;
