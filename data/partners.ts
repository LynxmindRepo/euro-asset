import { DisposalPartner } from "@/types";

// Fictional Disposal Partners. Websites use example.com so demo links never point to a real company.
export const partners: DisposalPartner[] = [
  {
    id: "partner-tagus",
    name: "Tagus Recovery Partners",
    type: "administrator",
    city: "Lisbon",
    country: "Portugal",
    website: "https://example.com/tagus-recovery",
    email: "sales@tagus-recovery.example",
    phone: "+351 210 000 100",
    verified: true,
    memberSince: "2025-02-01",
    description: "Insolvency administrators handling commercial and industrial estates across Portugal."
  },
  {
    id: "partner-levante",
    name: "Levante Asset Disposals",
    type: "disposal-firm",
    city: "Valencia",
    country: "Spain",
    website: "https://example.com/levante-disposals",
    email: "info@levante-disposals.example",
    phone: "+34 960 000 200",
    verified: true,
    memberSince: "2025-03-15",
    description: "Disposal firm specialised in energy and industrial assets on the Spanish east coast."
  },
  {
    id: "partner-navigli",
    name: "Navigli Aste Giudiziarie",
    type: "auctioneer",
    city: "Milan",
    country: "Italy",
    website: "https://example.com/navigli-aste",
    email: "contatti@navigli-aste.example",
    phone: "+39 02 0000 300",
    verified: true,
    memberSince: "2025-01-20",
    description: "Licensed auctioneer for court-ordered sales of real estate and equipment in Lombardy."
  },
  {
    id: "partner-calanques",
    name: "Calanques Liquidation Services",
    type: "administrator",
    city: "Marseille",
    country: "France",
    website: "https://example.com/calanques-liquidation",
    email: "contact@calanques-liquidation.example",
    phone: "+33 4 00 00 04 00",
    verified: true,
    memberSince: "2025-04-02",
    description: "Liquidators for logistics, port and manufacturing companies in southern France."
  },
  {
    id: "partner-rhein",
    name: "Rhein Industrie Verwertung",
    type: "disposal-firm",
    city: "Cologne",
    country: "Germany",
    website: "https://example.com/rhein-verwertung",
    email: "verkauf@rhein-verwertung.example",
    phone: "+49 221 0000 500",
    verified: true,
    memberSince: "2024-11-10",
    description: "Valuation and disposal of machinery, vehicles and production lines from German insolvencies."
  },
  {
    id: "partner-nordic",
    name: "Nordic Fleet Brokers",
    type: "broker",
    city: "Gothenburg",
    country: "Sweden",
    website: "https://example.com/nordic-fleet",
    email: "fleet@nordic-fleet.example",
    phone: "+46 31 000 06 00",
    verified: true,
    memberSince: "2025-05-05",
    description: "Brokers for commercial vehicle fleets released by restructurings in the Nordics."
  },
  {
    id: "partner-polder",
    name: "Polder Veilingen",
    type: "auctioneer",
    city: "Rotterdam",
    country: "Netherlands",
    website: "https://example.com/polder-veilingen",
    email: "info@polder-veilingen.example",
    phone: "+31 10 000 0700",
    verified: false,
    memberSince: "2025-08-18",
    description: "Licensed auctioneers for construction equipment and IT assets in the Benelux."
  }
];
