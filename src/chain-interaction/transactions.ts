import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import { CurrencyValue, Token } from "@usedapp/core/dist/esm/src/model";
import { useAddresses, useStable } from "./contracts";

import IsolatedLending from "../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json";
import { useContext } from "react";
import { UserAddressContext } from "../components/UserAddressContext";
// import { wrappedNativeCurrency } from "./tokens";

import IWETH from "../contracts/artifacts/interfaces/IWETH.sol/IWETH.json";
import { parseEther } from "@usedapp/core/node_modules/@ethersproject/units";

export function useMintDepositBorrowTrans() {
  const ilAddress = useAddresses().IsolatedLending;
  const ilContract = new Contract(ilAddress, new Interface(IsolatedLending.abi));
  const { send, state } = useContractFunction(ilContract, 'mintDepositAndBorrow');
  const account = useContext(UserAddressContext);
  const stable = useStable();


  return {
    sendMintDepositBorrow: (collateralToken: Token,
      strategyAddress: string,
      collateralAmount: number,
      borrowAmount: number) => stable ? send(
      collateralToken.address,
      strategyAddress,
      CurrencyValue.fromString(collateralToken, collateralAmount.toString()).value,
      CurrencyValue.fromString(stable, borrowAmount.toString()).value,
      account
    ) : console.error('Trying to send transaction but stable not defined!'),
    depositBorrowState: state
  };
}

export function useWrapNative() {
  // const { chainId } = useEthers();
  const wrapperAddress = '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'; // wrappedNativeCurrency.get(chainId ?? ChainId.Localhost)!.address;
  const wrapperContract = new Contract(wrapperAddress, new Interface(IWETH.abi));

  const { send, state } = useContractFunction(wrapperContract, 'deposit', {transactionName: 'Wrap'})

  return {
    sendWrapNative : (wrapAmount: number) => send({value: parseEther(wrapAmount.toString())}),
    wrapNativeState: state
  }
}