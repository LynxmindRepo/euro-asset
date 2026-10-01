// Fixed, indicative exchange rates — no external API is called at runtime.
// Values are the ECB reference rates of 30 Sep 2026 (1 EUR = x). Update by hand when needed.
export const RATES_DATE = "2026-09-30";
export const RATES_SOURCE = "ECB reference rates";

export type CurrencyInfo = {
  code: string;
  label: string;
  /** 1 EUR = rate × this currency. */
  rate: number;
};

export const currencyList: CurrencyInfo[] = [
  { code: "EUR", label: "Euro", rate: 1 },
  { code: "GBP", label: "British pound", rate: 0.8546 },
  { code: "SEK", label: "Swedish krona", rate: 11.331 },
  { code: "DKK", label: "Danish krone", rate: 7.4755 },
  { code: "NOK", label: "Norwegian krone", rate: 10.9015 },
  { code: "PLN", label: "Polish złoty", rate: 4.369 },
  { code: "CZK", label: "Czech koruna", rate: 24.44 },
  { code: "CHF", label: "Swiss franc", rate: 0.9478 },
  { code: "USD", label: "US dollar", rate: 1.1355 }
];

export const eurRates: Record<string, number> = Object.fromEntries(currencyList.map((item) => [item.code, item.rate]));

export const currencies = currencyList.map((item) => item.code);
