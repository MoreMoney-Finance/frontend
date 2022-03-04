import { Button, Flex } from '@chakra-ui/react';
import * as React from 'react';
import { TokenDescription } from '../../../../components/tokens/TokenDescription';
import { StrategyMetadataContext } from '../../../../contexts/StrategyMetadataContext';
import CopyClipboard from '../CopyClipboard/CopyClipboard';
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
          <th>Harvest</th>
        </thead>
        <tbody>
          {Object.values(stratMeta).map((strat) => {
            return Object.values(strat).map((strat, index) => {
              return (
                <tr key={strat.token.address + '' + index}>
                  <td>
                    <Flex justifyContent={'space-between'}>
                      <TokenDescription token={strat.token} />
                      <CopyClipboard value={strat.token.address} />
                    </Flex>
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
                  <td>
                    <Button>Harvest</Button>
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
