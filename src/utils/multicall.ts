import { ethers } from 'ethers';
import { Call, MulticallOptions, MultiCallResponse } from '@/typings/multicall';
import { getMulticallContract } from '@/utils/contractHelpers';
import splitArray from './splitArray';

const multicall = async <T = any>(
  abi: any[],
  calls: Call[],
  signer?: ethers.Signer | ethers.providers.Provider,
): Promise<T> => {
  try {
    const multi = getMulticallContract(signer);
    const itf = new ethers.utils.Interface(abi);

    const calldata = calls.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);
    const { returnData } = await multi.aggregate(calldata);

    const res = returnData.map((call: any, i: any) => itf.decodeFunctionResult(calls[i].name, call));

    return res;
  } catch (error: any) {
    throw new Error(error);
  }
};

/**
 * Multicall V2 uses the new "tryAggregate" function. It is different in 2 ways
 *
 * 1. If "requireSuccess" is false multicall will not bail out if one of the calls fails
 * 2. The return includes a boolean whether the call was successful e.g. [wasSuccessful, callResult]
 */
export const multicallv2 = async <T = any>(
  abi: any[],
  calls: Call[],
  signer?: ethers.Signer | ethers.providers.Provider,
  options: MulticallOptions = { requireSuccess: true },
): Promise<MultiCallResponse<T>> => {
  const { requireSuccess } = options;
  const multi = getMulticallContract(signer);
  const itf = new ethers.utils.Interface(abi);

  const calldata = calls.map((call) => [
    call.address.toLowerCase(),
    itf.encodeFunctionData(call.name, call.params),
  ]);
  const returnData = await multi.tryAggregate(requireSuccess, calldata);
  const res = returnData.map((call: any, i: any) => {
    const [result, data] = call;
    return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
  });

  return res;
};

/**
 * Multicall V3 for a large amount of data
 */
export const multicallv3 = async <T = any>(
  abi: any[],
  calls: Call[],
  signer?: ethers.Signer | ethers.providers.Provider,
  options: MulticallOptions = { requireSuccess: true, oncePreGroup: 300 },
): Promise<MultiCallResponse<T>> => {
  const { requireSuccess, oncePreGroup } = options;
  const multi = getMulticallContract(signer);
  const itf = new ethers.utils.Interface(abi);

  const callGroup = splitArray(calls, oncePreGroup);
  const callRq = [];

  for (let callGroupItem of callGroup) {
    const calldata = callGroupItem.map((call) => [
      call.address.toLowerCase(),
      itf.encodeFunctionData(call.name, call.params),
    ]);
    callRq.push(async () => {
      const returnData = await multi.tryAggregate(requireSuccess, calldata);
      return returnData.map((call: any, i: any) => {
        const [result, data] = call;
        return result ? itf.decodeFunctionResult(calls[i].name, data) : null;
      });
    });
  }

  const returnDatas = await Promise.all(callRq.map((call) => call()));
  return [].concat(...returnDatas).filter((item) => item) as any;
};

export default multicall;
