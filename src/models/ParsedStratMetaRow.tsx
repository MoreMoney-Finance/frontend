import { CurrencyValue } from "@usedapp/core";

interface ParsedStratMetaRow {
	debtCeiling: CurrencyValue;
	totalDebt: CurrencyValue;
	stabilityFeePercent: number;
	mintingFeePercent: number;
	strategyAddress: string;
	token: any;
	APY: number;
	totalCollateral: CurrencyValue;
	borrowablePercent: number;
	usdPrice: number;
	strategyName: string;
	liqThreshPercent: number;
	tvlInToken: CurrencyValue;
	tvlInPeg: CurrencyValue;
	harvestBalance2Tally: CurrencyValue;
	yieldType: any;
}