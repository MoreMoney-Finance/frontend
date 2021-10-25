import { Interface } from "@ethersproject/abi";
import { Contract } from "@ethersproject/contracts";
import { useContractFunction } from "@usedapp/core";
import { CurrencyValue, Token } from "@usedapp/core/dist/esm/src/model";
import { useAddresses, useStable } from "./contracts";

import IsolatedLending from "../contracts/artifacts/contracts/IsolatedLending.sol/IsolatedLending.json";
import { useContext } from "react";
import { UserAddressContext } from "../components/UserAddressContext";

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