import * as React from "react";
import { Accordion } from "@chakra-ui/accordion";
import {
  ParsedStratMetaRow,
  useIsolatedStrategyMetadata,
} from "../chain-interaction/contracts";
import { IsolatedTranche } from "./IsolatedTranche";

export function IsolatedLending() {
  console.log("getting strat meta");
  // const stratMeta:ParsedStratMetaRow[] = [];
  const stratMeta: ParsedStratMetaRow[] = useIsolatedStrategyMetadata();
  console.log(stratMeta);
  return (
    <Accordion allowToggle allowMultiple defaultIndex={[0]}>
      {stratMeta.map((meta, i) => (
        <IsolatedTranche key={i + 1} {...meta} />
      ))}
    </Accordion>
  );
}
