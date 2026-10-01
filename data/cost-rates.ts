// Indicative, fictional rates used by the Cost Estimator demo. Not real tariffs.

export type BuyerCountry = {
  name: string;
  /** Reference city used for the road distance. */
  city: string;
  lat: number;
  lon: number;
  currency: string;
  /** Outside the EU single market → customs clearance applies. */
  eu: boolean;
  /** Reached by ferry from mainland Europe. */
  ferry: boolean;
  /** Typical re-registration cost per vehicle/machine, in EUR. */
  registrationFee: number;
  /** Typical property transfer taxes + notary, as a share of the price. */
  propertyTransferRate: number;
};

export const buyerCountries: BuyerCountry[] = [
  { name: "Austria", city: "Vienna", lat: 48.21, lon: 16.37, currency: "EUR", eu: true, ferry: false, registrationFee: 340, propertyTransferRate: 0.065 },
  { name: "Belgium", city: "Brussels", lat: 50.85, lon: 4.35, currency: "EUR", eu: true, ferry: false, registrationFee: 300, propertyTransferRate: 0.12 },
  { name: "Czechia", city: "Prague", lat: 50.08, lon: 14.44, currency: "CZK", eu: true, ferry: false, registrationFee: 200, propertyTransferRate: 0.04 },
  { name: "Denmark", city: "Copenhagen", lat: 55.68, lon: 12.57, currency: "DKK", eu: true, ferry: false, registrationFee: 1200, propertyTransferRate: 0.02 },
  { name: "France", city: "Paris", lat: 48.86, lon: 2.35, currency: "EUR", eu: true, ferry: false, registrationFee: 320, propertyTransferRate: 0.075 },
  { name: "Germany", city: "Frankfurt", lat: 50.11, lon: 8.68, currency: "EUR", eu: true, ferry: false, registrationFee: 280, propertyTransferRate: 0.065 },
  { name: "Ireland", city: "Dublin", lat: 53.35, lon: -6.26, currency: "EUR", eu: true, ferry: true, registrationFee: 600, propertyTransferRate: 0.075 },
  { name: "Italy", city: "Milan", lat: 45.46, lon: 9.19, currency: "EUR", eu: true, ferry: false, registrationFee: 520, propertyTransferRate: 0.09 },
  { name: "Netherlands", city: "Rotterdam", lat: 51.92, lon: 4.48, currency: "EUR", eu: true, ferry: false, registrationFee: 350, propertyTransferRate: 0.104 },
  { name: "Norway", city: "Oslo", lat: 59.91, lon: 10.75, currency: "NOK", eu: false, ferry: false, registrationFee: 500, propertyTransferRate: 0.025 },
  { name: "Poland", city: "Warsaw", lat: 52.23, lon: 21.01, currency: "PLN", eu: true, ferry: false, registrationFee: 220, propertyTransferRate: 0.02 },
  { name: "Portugal", city: "Lisbon", lat: 38.72, lon: -9.14, currency: "EUR", eu: true, ferry: false, registrationFee: 450, propertyTransferRate: 0.075 },
  { name: "Spain", city: "Madrid", lat: 40.42, lon: -3.7, currency: "EUR", eu: true, ferry: false, registrationFee: 380, propertyTransferRate: 0.08 },
  { name: "Sweden", city: "Gothenburg", lat: 57.71, lon: 11.97, currency: "SEK", eu: true, ferry: false, registrationFee: 260, propertyTransferRate: 0.0425 },
  { name: "Switzerland", city: "Zurich", lat: 47.38, lon: 8.54, currency: "CHF", eu: false, ferry: false, registrationFee: 400, propertyTransferRate: 0.03 },
  { name: "United Kingdom", city: "London", lat: 51.51, lon: -0.13, currency: "GBP", eu: false, ferry: true, registrationFee: 450, propertyTransferRate: 0.05 }
];

/** Asset locations used by the mock listings (anything else falls back to the country's reference city). */
export const assetCities: Record<string, { lat: number; lon: number }> = {
  Lisbon: { lat: 38.72, lon: -9.14 },
  Valencia: { lat: 39.47, lon: -0.38 },
  Milan: { lat: 45.46, lon: 9.19 },
  Marseille: { lat: 43.3, lon: 5.37 },
  Gothenburg: { lat: 57.71, lon: 11.97 },
  Cologne: { lat: 50.94, lon: 6.96 },
  Rotterdam: { lat: 51.92, lon: 4.48 },
  Braga: { lat: 41.55, lon: -8.42 }
};

/** Indicative exchange rates: 1 EUR = x. */
export const eurRates: Record<string, number> = {
  EUR: 1,
  SEK: 11.2,
  DKK: 7.46,
  NOK: 11.6,
  PLN: 4.3,
  CZK: 25.1,
  CHF: 0.94,
  GBP: 0.85,
  USD: 1.08
};

export const currencies = Object.keys(eurRates);

export const transportRates = {
  /** Vehicles driven or carried on a car transporter. */
  vehicle: { perKm: 0.9, handling: 200 },
  /** Standard truck freight, per truck (up to 24 t). */
  truck: { perKm: 1.5, handling: 250, capacityKg: 24000 },
  /** Low-loader for heavy machinery (single items of 12 t or more). */
  lowLoader: { perKm: 2.4, handling: 600, heavyFromKg: 12000 },
  ferry: 450,
  roadFactor: 1.25
};

export const fxSpread = 0.015;
export const customsClearance = 350;
/** Ownership transfer when buyer and asset are in the same country, as a share of the re-registration fee. */
export const domesticTransferShare = 0.3;
export const energyTransferRate = 0.025;

/** Map a browser language (e.g. "pt-PT", "sv") to a default buyer country. */
export const languageCountry: Record<string, string> = {
  pt: "Portugal",
  es: "Spain",
  fr: "France",
  it: "Italy",
  de: "Germany",
  nl: "Netherlands",
  sv: "Sweden",
  da: "Denmark",
  nb: "Norway",
  no: "Norway",
  pl: "Poland",
  cs: "Czechia",
  "en-GB": "United Kingdom",
  "en-IE": "Ireland"
};
