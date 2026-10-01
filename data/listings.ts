import { Listing } from "@/types";

export const initialListings: Listing[] = [
  {
    id: "lisbon-logistics-terminal",
    title: "Multimodal logistics terminal in Lisbon",
    description:
      "Large logistics terminal with rail access, road frontage and 42 loading docks, sold by the insolvency estate of the former operator. Suitable for logistics occupiers or investors looking for expansion capacity next to the port of Lisbon.",
    categoryId: "real-estate",
    origin: "insolvency",
    status: "available",
    price: 4680000,
    currency: "EUR",
    city: "Lisbon",
    region: "Greater Lisbon",
    country: "Portugal",
    images: [
      "/lisbon-terminal-hero.png",
      "/lisbon-terminal-docks.png",
      "/lisbon-terminal-interior.png",
      "/lisbon-terminal-aerial.png"
    ],
    specs: [
      { label: "Covered area", value: 38500, unit: "m2" },
      { label: "Plot", value: 61000, unit: "m2" },
      { label: "Loading docks", value: 42, unit: "units" },
      { label: "Built", value: 2009, unit: "year" }
    ],
    highlights: ["Direct rail siding", "15 min from the port of Lisbon", "Partially let — income from day one"],
    partnerId: "partner-tagus",
    requiresRegistration: false,
    publishedAt: "2026-09-12T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "valencia-solar-portfolio",
    title: "Industrial rooftop solar portfolio, Valencia",
    description:
      "Portfolio of rooftop solar installations on industrial buildings around Valencia, released through a restructuring. Grid-connected and producing, with maintenance contracts in place.",
    categoryId: "energy",
    origin: "restructuring",
    status: "available",
    price: 3290000,
    currency: "EUR",
    city: "Valencia",
    region: "Valencian Community",
    country: "Spain",
    images: [
      "/valencia-solar-hero.png",
      "/valencia-solar-panels.png",
      "/valencia-solar-substation.png",
      "/valencia-solar-aerial.png"
    ],
    specs: [
      { label: "Installed capacity", value: 4800, unit: "kWp" },
      { label: "Sites", value: 9, unit: "units" },
      { label: "Commissioned", value: 2019, unit: "year" }
    ],
    highlights: ["Producing and grid-connected", "O&M contracts transferable", "Monitoring data available"],
    partnerId: "partner-levante",
    requiresRegistration: false,
    publishedAt: "2026-09-02T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "milan-office-campus",
    title: "Office campus with repositioning potential, Milan",
    description:
      "Court-ordered sale of a modern office campus in Milan's northern business district. Vacant and ready for refurbishment or conversion, with good public transport connections.",
    categoryId: "real-estate",
    origin: "judicial-sale",
    status: "available",
    price: 5600000,
    currency: "EUR",
    city: "Milan",
    region: "Lombardy",
    country: "Italy",
    images: ["/milan-campus-hero.png", "/milan-campus-lobby.png", "/milan-campus-office.png"],
    specs: [
      { label: "Gross floor area", value: 21400, unit: "m2" },
      { label: "Parking spaces", value: 310, unit: "units" },
      { label: "Built", value: 2004, unit: "year" }
    ],
    highlights: ["Vacant possession", "Metro station within 400 m", "Planning for mixed use under review"],
    partnerId: "partner-navigli",
    requiresRegistration: false,
    publishedAt: "2026-08-28T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "marseille-port-warehouses",
    title: "Port-side warehouse hub, Marseille",
    description:
      "Liquidation sale of a warehouse hub on the Marseille port corridor, including offices, yard and container handling areas. Sold as a whole.",
    categoryId: "real-estate",
    origin: "liquidation",
    status: "reserved",
    price: 9730000,
    currency: "EUR",
    city: "Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    country: "France",
    images: ["/marseille-hub-hero.png", "/marseille-hub-port.png", "/marseille-hub-interior.png"],
    specs: [
      { label: "Covered area", value: 52000, unit: "m2" },
      { label: "Yard", value: 30000, unit: "m2" },
      { label: "Built", value: 1998, unit: "year" }
    ],
    highlights: ["Direct port access", "Container yard included", "Offer accepted — back-up offers welcome"],
    partnerId: "partner-calanques",
    requiresRegistration: false,
    publishedAt: "2026-08-20T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "volvo-fh-tractor-unit",
    title: "Volvo FH 500 tractor unit, 2019",
    description:
      "Well-maintained 4x2 tractor unit from a haulage company's restructured fleet. Full service history, recent tyres, ready for registration in any EU country.",
    categoryId: "vehicles",
    origin: "restructuring",
    status: "available",
    price: 48500,
    currency: "EUR",
    city: "Gothenburg",
    region: "Västra Götaland",
    country: "Sweden",
    images: ["/listings/truck.svg"],
    specs: [
      { label: "Mileage", value: 612000, unit: "km" },
      { label: "Weight", value: 7800, unit: "kg" },
      { label: "Year", value: 2019, unit: "year" },
      { label: "Emission class", value: "Euro 6" }
    ],
    highlights: ["Full service history", "Retarder and ADR equipped", "Seven identical units available"],
    partnerId: "partner-nordic",
    requiresRegistration: true,
    publishedAt: "2026-09-27T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "sprinter-van-fleet",
    title: "Fleet of 6 Mercedes-Benz Sprinter vans",
    description:
      "Six panel vans from a courier company's insolvency, sold as one lot. All vans run and drive; individual inspection reports available on request.",
    categoryId: "vehicles",
    origin: "insolvency",
    status: "available",
    price: 96000,
    currency: "EUR",
    city: "Cologne",
    region: "North Rhine-Westphalia",
    country: "Germany",
    images: ["/listings/vans.svg"],
    specs: [
      { label: "Vehicles", value: 6, unit: "units" },
      { label: "Average mileage", value: 184000, unit: "km" },
      { label: "Year", value: 2020, unit: "year" }
    ],
    highlights: ["Sold as one lot", "Inspection reports available", "Shelving installed in 4 vans"],
    partnerId: "partner-rhein",
    requiresRegistration: true,
    publishedAt: "2026-09-25T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "refrigerated-trailer",
    title: "Refrigerated semi-trailer, 2018",
    description:
      "Three-axle reefer trailer with a diesel cooling unit, released from a food distributor's liquidation. Cooling unit serviced in 2026.",
    categoryId: "vehicles",
    origin: "liquidation",
    status: "sold",
    price: 21500,
    currency: "EUR",
    city: "Lisbon",
    region: "Greater Lisbon",
    country: "Portugal",
    images: ["/listings/trailer.svg"],
    specs: [
      { label: "Weight", value: 9200, unit: "kg" },
      { label: "Cooling unit hours", value: 11200, unit: "h" },
      { label: "Year", value: 2018, unit: "year" }
    ],
    highlights: ["Cooling unit serviced 2026", "Pharma-grade temperature logging"],
    partnerId: "partner-tagus",
    requiresRegistration: true,
    publishedAt: "2026-08-30T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "caterpillar-320-excavator",
    title: "Caterpillar 320 crawler excavator",
    description:
      "21-tonne crawler excavator from a construction company's bankruptcy. Undercarriage at around 60%, with a digging bucket and quick coupler included.",
    categoryId: "machinery",
    origin: "insolvency",
    status: "available",
    price: 62000,
    currency: "EUR",
    city: "Rotterdam",
    region: "South Holland",
    country: "Netherlands",
    images: ["/listings/excavator.svg"],
    specs: [
      { label: "Operating hours", value: 8400, unit: "h" },
      { label: "Operating weight", value: 21000, unit: "kg" },
      { label: "Year", value: 2017, unit: "year" }
    ],
    highlights: ["Quick coupler and bucket included", "Undercarriage ~60%", "Viewing by appointment"],
    partnerId: "partner-polder",
    requiresRegistration: true,
    publishedAt: "2026-09-22T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "electric-forklift-lot",
    title: "Lot of 4 electric forklifts with chargers",
    description:
      "Four 1.6-tonne electric counterbalance forklifts with chargers, from a warehouse closure. Batteries replaced in 2024.",
    categoryId: "machinery",
    origin: "liquidation",
    status: "available",
    price: 28000,
    currency: "EUR",
    city: "Marseille",
    region: "Provence-Alpes-Côte d'Azur",
    country: "France",
    images: ["/listings/forklift.svg"],
    specs: [
      { label: "Units", value: 4, unit: "units" },
      { label: "Lift capacity (each)", value: 1600, unit: "kg" },
      { label: "Average hours", value: 5200, unit: "h" }
    ],
    highlights: ["Batteries replaced 2024", "Chargers included", "Can be sold individually"],
    partnerId: "partner-calanques",
    requiresRegistration: false,
    publishedAt: "2026-09-18T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "cnc-machining-centre",
    title: "5-axis CNC machining centre",
    description:
      "High-precision 5-axis vertical machining centre from an automotive supplier's insolvency. Under power and can be demonstrated on site.",
    categoryId: "machinery",
    origin: "insolvency",
    status: "available",
    price: 145000,
    currency: "EUR",
    city: "Cologne",
    region: "North Rhine-Westphalia",
    country: "Germany",
    images: ["/listings/cnc.svg"],
    specs: [
      { label: "Spindle hours", value: 14600, unit: "h" },
      { label: "Machine weight", value: 9500, unit: "kg" },
      { label: "Year", value: 2016, unit: "year" }
    ],
    highlights: ["Under power — demo possible", "Tooling package included", "Rigging quotes available"],
    partnerId: "partner-rhein",
    requiresRegistration: false,
    publishedAt: "2026-09-15T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "bakery-production-line",
    title: "Complete industrial bakery production line",
    description:
      "Bread production line with mixers, proofing cabinets, a tunnel oven and packaging, from a bakery's liquidation. Dismantling by the buyer.",
    categoryId: "machinery",
    origin: "liquidation",
    status: "available",
    price: 210000,
    currency: "EUR",
    city: "Milan",
    region: "Lombardy",
    country: "Italy",
    images: ["/listings/production-line.svg"],
    specs: [
      { label: "Capacity", value: "3,000 loaves/hour" },
      { label: "Total weight", value: 38000, unit: "kg" },
      { label: "Year", value: 2015, unit: "year" }
    ],
    highlights: ["Complete line, sold as a whole", "Documentation and manuals available"],
    partnerId: "partner-navigli",
    requiresRegistration: false,
    publishedAt: "2026-09-08T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "sportswear-retail-stock",
    title: "Sportswear retail stock — 18,000 units",
    description:
      "New-with-tags sportswear and footwear from a retail chain's insolvency, sold in one lot. Packing lists by size and SKU available.",
    categoryId: "inventory",
    origin: "insolvency",
    status: "available",
    price: 72000,
    currency: "EUR",
    city: "Valencia",
    region: "Valencian Community",
    country: "Spain",
    images: ["/listings/pallets.svg"],
    specs: [
      { label: "Units", value: 18000, unit: "units" },
      { label: "Pallets", value: 46, unit: "units" },
      { label: "Total weight", value: 14200, unit: "kg" }
    ],
    highlights: ["New with tags", "Packing lists by SKU", "Ex-warehouse Valencia"],
    partnerId: "partner-levante",
    requiresRegistration: false,
    publishedAt: "2026-09-29T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "server-cluster",
    title: "Data centre server cluster — 32 nodes",
    description:
      "32 rack servers with switches and racks from a hosting company's restructuring. Drives securely wiped with certificates.",
    categoryId: "it-office",
    origin: "restructuring",
    status: "available",
    price: 54000,
    currency: "EUR",
    city: "Rotterdam",
    region: "South Holland",
    country: "Netherlands",
    images: ["/listings/servers.svg"],
    specs: [
      { label: "Servers", value: 32, unit: "units" },
      { label: "Racks", value: 4, unit: "units" },
      { label: "Total weight", value: 1900, unit: "kg" }
    ],
    highlights: ["Certified data wiping", "Switches and PDUs included"],
    partnerId: "partner-polder",
    requiresRegistration: false,
    publishedAt: "2026-09-20T09:00:00.000Z",
    createdBy: "system"
  },
  {
    id: "office-furniture-it",
    title: "Office furniture and IT for 240 workstations",
    description:
      "Desks, ergonomic chairs, monitors and meeting room furniture from a headquarters closure. Can be split into smaller lots.",
    categoryId: "it-office",
    origin: "private-sale",
    status: "available",
    price: 38000,
    currency: "EUR",
    city: "Lisbon",
    region: "Greater Lisbon",
    country: "Portugal",
    images: ["/listings/office.svg"],
    specs: [
      { label: "Workstations", value: 240, unit: "units" },
      { label: "Monitors", value: 310, unit: "units" },
      { label: "Total weight", value: 16500, unit: "kg" }
    ],
    highlights: ["Can be split into lots", "Collection from Lisbon city centre"],
    partnerId: "partner-tagus",
    requiresRegistration: false,
    publishedAt: "2026-09-10T09:00:00.000Z",
    createdBy: "system"
  }
];
