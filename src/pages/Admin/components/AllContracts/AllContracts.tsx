import { Button } from '@chakra-ui/react';
import * as React from 'react';
import { TokenDescription } from '../../../../components/tokens/TokenDescription';
import { StrategyMetadataContext } from '../../../../contexts/StrategyMetadataContext';
import UpdatePriceOracle from './components/UpdatePriceOracle';

export default function AllContracts(props: React.PropsWithChildren<unknown>) {
  const stratMeta = React.useContext(StrategyMetadataContext);
  return (
    <div>
      <br />
      <br />
      <br />
      <table>
        <thead>
          <th>Asset</th>
          <th>Strategy</th>
          <th>Fees</th>
          <th>Oracle</th>
        </thead>
        <tbody>
          {Object.values(stratMeta).map((strat) => {
            return Object.values(strat).map((strat, index) => {
              return (
                <tr key={strat.token.address + '' + index}>
                  <td>
                    <TokenDescription token={strat.token} />
                  </td>
                  <td>
                    <p>{strat.strategyName}</p>
                  </td>
                  <td>
                    <Button>Withdraw Fees</Button>
                  </td>
                  <td>
                    <UpdatePriceOracle token={strat.token} />
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
      {props.children}
    </div>
  );
}
