import { BigNumber, Contract, ethers } from 'ethers';
import { Amount } from '@/typings/swap';
import { getTokenContract } from './contractHelpers';

class Token {
  contract: Contract = null;
  signer: ethers.Signer = null;

  // @dev common used token address
  static WBNB = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
  static BUSD = '';
  static USDT = '';

  constructor(address: string, signer: ethers.Signer) {
    this.contract = getTokenContract(address, signer);
    this.signer = signer;
  }

  name() {
    return this.contract.name();
  }

  symbol() {
    return this.contract.symbol();
  }

  async balance() {
    const address = await this.signer.getAddress();
    return this.contract.balanceOf(address);
  }

  balanceOf(address: string) {
    return this.contract.balanceOf(address);
  }

  decimals() {
    return this.contract.decimals();
  }

  async allowance(targetAddress: string) {
    const selfAddress = await this.signer.getAddress();
    return this.contract.allowance(selfAddress, targetAddress);
  }

  approve(address: string, amount: Amount) {
    return this.contract.approve(address, amount);
  }

  async format(amount: BigNumber) {
    const decimals = await this.decimals();
    return ethers.utils.formatUnits(amount, decimals);
  }

  async parse(amount: string) {
    const decimals = await this.decimals();
    return ethers.utils.parseUnits(amount, decimals);
  }
}

export default Token;
