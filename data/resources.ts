import { customsClearance, fxSpread, transportRates } from "@/data/cost-rates";
import { formatCurrency } from "@/lib/utils";

// "Partners & Resources": services a buyer needs after finding an asset. All partners are fictional examples
// for the prototype (no real companies, no logos). In the real product these could be referral partnerships.

export type ResourceCategory = {
  id: "logistics" | "currency" | "insurance" | "registration" | "financing";
  title: string;
  description: string;
  /** Typical cost, consistent with the Cost Estimator rates. */
  typicalCost: string;
};

export type ServicePartner = {
  id: string;
  categoryId: ResourceCategory["id"];
  name: string;
  description: string;
  coverage: string;
};

export const resourceCategories: ResourceCategory[] = [
  {
    id: "logistics",
    title: "Logistics & shipping",
    description: "Road freight, car transporters and heavy haulage to move the asset from the seller to you.",
    // Per-km rates need cents, so not formatCurrency (which rounds to whole euros).
    typicalCost: `Truck freight from ~€${transportRates.truck.perKm.toFixed(2)}/km, low-loaders from ~€${transportRates.lowLoader.perKm.toFixed(
      2
    )}/km`
  },
  {
    id: "currency",
    title: "Currency exchange",
    description: "Pay sellers in EUR without losing money on the exchange — specialists usually beat bank rates.",
    typicalCost: `Banks ~${(fxSpread * 100).toFixed(1)}% spread · specialists from ~0.4%`
  },
  {
    id: "insurance",
    title: "Insurance",
    description: "Cover the asset while it travels and once it is in your hands.",
    typicalCost: "Goods-in-transit cover from ~0.3% of the asset value"
  },
  {
    id: "registration",
    title: "Vehicle & machinery re-registration and import",
    description: "New plates, technical inspections and customs paperwork for the buyer's country.",
    typicalCost: `Re-registration €200–1,200 per vehicle · customs clearance outside the EU ~${formatCurrency(customsClearance)}`
  },
  {
    id: "financing",
    title: "Financing, secure payments & escrow",
    description: "Finance the purchase, or keep the money safe in escrow until the asset is delivered.",
    typicalCost: "Escrow from ~0.5% of the price · asset finance on request"
  }
];

export const servicePartners: ServicePartner[] = [
  {
    id: "northbridge-freight",
    categoryId: "logistics",
    name: "Northbridge Freight",
    description: "Full-truck loads and car transporters across the EU, with tracking.",
    coverage: "All EU countries, UK and Norway"
  },
  {
    id: "corridor-heavy-haulage",
    categoryId: "logistics",
    name: "Corridor Heavy Haulage",
    description: "Low-loaders and escorts for excavators, cranes and production lines.",
    coverage: "Machinery up to 60 t, Europe-wide"
  },
  {
    id: "clearrate-fx",
    categoryId: "currency",
    name: "ClearRate FX",
    description: "Business currency transfers with a locked-in rate for the day of payment.",
    coverage: "30+ currencies"
  },
  {
    id: "pivot-pay",
    categoryId: "currency",
    name: "Pivot Pay",
    description: "Multi-currency business account to hold EUR, SEK, GBP and more.",
    coverage: "EU and UK companies"
  },
  {
    id: "meridian-transit",
    categoryId: "insurance",
    name: "Meridian Transit Insurance",
    description: "Goods-in-transit cover from collection to delivery, arranged per shipment.",
    coverage: "Road and short-sea shipments in Europe"
  },
  {
    id: "anchor-asset-cover",
    categoryId: "insurance",
    name: "Anchor Asset Cover",
    description: "Insurance for machinery and vehicles from day one of ownership.",
    coverage: "Business buyers in 12 countries"
  },
  {
    id: "plateswitch",
    categoryId: "registration",
    name: "PlateSwitch Registration",
    description: "Handles inspections, plates and paperwork to re-register vehicles and machines.",
    coverage: "Re-registration in 12 EU countries"
  },
  {
    id: "borderdocs",
    categoryId: "registration",
    name: "BorderDocs Customs",
    description: "Customs declarations and import VAT for buyers outside the EU.",
    coverage: "United Kingdom, Switzerland, Norway"
  },
  {
    id: "keystone-trade-finance",
    categoryId: "financing",
    name: "Keystone Trade Finance",
    description: "Asset finance and leasing for companies buying used equipment.",
    coverage: "Companies in the EU"
  },
  {
    id: "safehold-escrow",
    categoryId: "financing",
    name: "SafeHold Escrow",
    description: "Holds the payment until the asset is delivered and accepted — safer cross-border deals.",
    coverage: "All markets covered by Bridgeon"
  }
];

/** Which resource categories help with each Cost Estimator line. */
export const estimatorLineResources: Record<string, ResourceCategory["id"][]> = {
  transport: ["logistics", "insurance"],
  ferry: ["logistics"],
  fx: ["currency"],
  registration: ["registration"],
  customs: ["registration"],
  transfer: ["financing"]
};
