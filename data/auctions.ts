import { Auction } from "@/types";

export const initialAuctions: Auction[] = [
  {
    id: "auc-lisboa-terminal",
    slug: "terminal-logistico-lisboa",
    title: "Lisbon multimodal logistics terminal",
    location: "Lisboa",
    region: "Grande Lisboa",
    country: "Portugal",
    jurisdiction: "Comarca de Lisboa",
    currency: "EUR",
    categoryId: "logistica",
    status: "a-encerrar",
    saleProcedure: "insolvencia",
    description:
      "Large-format multimodal logistics asset originating from an insolvency process, combining rail access, road frontage, and immediate expansion capacity for industrial occupiers or value-add operators.",
    executiveSummary: [
      "Core logistics platform with institutional scale and clear Iberian distribution relevance.",
      "Advanced-stage insolvency process with principal documentation already curated for review.",
      "Strong hero case for demo purposes, combining legal clarity, operating context, and current proposal tension."
    ],
    highlights: [
      "22,400 sqm of warehouse and yard area",
      "Active rail spur and direct motorway access",
      "Partial occupancy agreement currently in force with rollover under review"
    ],
    legalNotes: [
      "Sale conducted within a court-supervised insolvency process under the oversight of the appointed administrator.",
      "Transfer remains subject to bidder eligibility review, procedural approval, and confirmation of closing mechanics."
    ],
    submissionRequirements: [
      "Proof of financial capacity and funding route",
      "Identification of the proposing entity and beneficial ownership",
      "Signed acceptance of the sale conditions and process timetable"
    ],
    documents: [
      { id: "doc-1", label: "Asset teaser", type: "teaser", availability: "disponivel" },
      { id: "doc-2", label: "Process memorandum", type: "caderno-encargos", availability: "disponivel" },
      { id: "doc-3", label: "Legal report", type: "legal", availability: "sob-pedido" },
      { id: "doc-11", label: "Independent valuation report", type: "avaliacao", availability: "disponivel" },
      { id: "doc-12", label: "Operating financial summary", type: "financeiro", availability: "sob-pedido" },
      { id: "doc-15", label: "Occupancy and lease schedule", type: "financeiro", availability: "disponivel" },
      { id: "doc-16", label: "Environmental and utilities summary", type: "legal", availability: "sob-pedido" }
    ],
    basePrice: 4200000,
    currentBid: 4680000,
    reserveMet: true,
    startDate: "2026-03-01T09:00:00.000Z",
    endDate: "2026-04-10T18:00:00.000Z",
    images: [
      "/lisbon-terminal-hero.png",
      "/lisbon-terminal-docks.png",
      "/lisbon-terminal-interior.png",
      "/lisbon-terminal-aerial.png"
    ],
    bids: [
      { id: "bid-1", userId: "user-1", amount: 4460000, createdAt: "2026-03-18T14:20:00.000Z" },
      { id: "bid-2", userId: "admin-1", amount: 4520000, createdAt: "2026-03-19T10:05:00.000Z" },
      { id: "bid-3", userId: "user-1", amount: 4680000, createdAt: "2026-03-22T16:40:00.000Z" }
    ],
    seller: "Terminal Atlantico Insolvency Estate",
    lot: "LT-203",
    caseReference: "INS-LX-2026-114",
    administratorName: "Marta Azevedo",
    administratorEntity: "Azevedo & Associados",
    occupancyStatus: "Partially occupied",
    encumbrancesSummary: "Technical easements, utility corridors, and operating agreements under review",
    createdBy: "admin-1"
  },
  {
    id: "auc-valencia-solar",
    slug: "portfolio-solar-valencia",
    title: "Valencia industrial solar portfolio",
    location: "Valencia",
    region: "Comunidade Valenciana",
    country: "Espanha",
    jurisdiction: "Juzgado Mercantil de Valencia",
    currency: "EUR",
    categoryId: "energia",
    status: "aberto",
    saleProcedure: "reestruturacao",
    description:
      "Portfolio of photovoltaic units in a restructuring context, with predictable revenues and expansion potential.",
    executiveSummary: [
      "Energy portfolio with recurring revenues and strong appeal for infra-core operators.",
      "Restructuring process with controlled data room access and NDA upon request."
    ],
    highlights: [
      "14 MW installed capacity",
      "Indexed revenue profile",
      "Technical due diligence available"
    ],
    legalNotes: [
      "Sale embedded in a restructuring process led by appointed financial advisers.",
      "Full documentation available upon request and subject to confidentiality clearance."
    ],
    submissionRequirements: [
      "Letter of intent",
      "Proof of source of funds",
      "Shareholding structure of the proposing entity"
    ],
    documents: [
      { id: "doc-4", label: "Investment memorandum", type: "teaser", availability: "disponivel" },
      { id: "doc-5", label: "Valuation report", type: "avaliacao", availability: "disponivel" },
      { id: "doc-6", label: "Data room NDA", type: "nda", availability: "sob-pedido" }
    ],
    basePrice: 3100000,
    currentBid: 3290000,
    reserveMet: false,
    startDate: "2026-03-08T09:00:00.000Z",
    endDate: "2026-04-22T18:00:00.000Z",
    images: [
      "/valencia-solar-hero.png",
      "/valencia-solar-panels.png",
      "/valencia-solar-substation.png",
      "/valencia-solar-aerial.png"
    ],
    bids: [
      { id: "bid-4", userId: "user-1", amount: 3215000, createdAt: "2026-03-21T11:00:00.000Z" },
      { id: "bid-5", userId: "admin-1", amount: 3290000, createdAt: "2026-03-23T09:45:00.000Z" }
    ],
    seller: "Valencia Solar HoldCo",
    lot: "EN-084",
    caseReference: "RST-ES-2026-088",
    administratorName: "Joao Simoes",
    administratorEntity: "IberRestruct Advisors",
    occupancyStatus: "Operational",
    encumbrancesSummary: "Equipment pledges and power purchase agreements in force",
    createdBy: "admin-1"
  },
  {
    id: "auc-milao-campus",
    slug: "campus-administrativo-milao",
    title: "Milan administrative campus with repositioning potential",
    location: "Milao",
    region: "Lombardia",
    country: "Italia",
    jurisdiction: "Tribunale di Milano",
    currency: "EUR",
    categoryId: "imobiliario",
    status: "agendado",
    saleProcedure: "venda-judicial",
    description:
      "Collection of interconnected administrative buildings within a judicial sale process, suitable for phased repositioning into mixed-use, flex office, or hospitality-led redevelopment.",
    executiveSummary: [
      "Urban repositioning real estate case with a clear judicial framework and visible timetable discipline.",
      "Useful hero case for explaining the distinction between judicial sale procedure and insolvency-led disposals.",
      "Vacant control and central Milan positioning support multiple repositioning narratives for investors."
    ],
    highlights: [
      "6 interconnected buildings across a single repositioning perimeter",
      "Preliminary redevelopment concept included in the process pack",
      "Private parking, internal courtyard access, and vacant delivery profile"
    ],
    legalNotes: [
      "Disposal through judicial sale with a predefined procedural calendar and court-governed bid mechanics.",
      "Acquisition remains subject to final court approval and satisfaction of procedural deposit requirements."
    ],
    submissionRequirements: [
      "Binding proposal in prescribed format",
      "Evidence of deposit or acceptable security package",
      "Express acceptance of the judicial sale rules and process memorandum"
    ],
    documents: [
      { id: "doc-7", label: "Sale notice", type: "legal", availability: "disponivel" },
      { id: "doc-8", label: "Valuation report", type: "avaliacao", availability: "disponivel" },
      { id: "doc-17", label: "Redevelopment concept summary", type: "teaser", availability: "disponivel" },
      { id: "doc-18", label: "Court timetable and deposit guidance", type: "legal", availability: "disponivel" }
    ],
    basePrice: 5600000,
    currentBid: 5600000,
    reserveMet: false,
    startDate: "2026-04-12T09:00:00.000Z",
    endDate: "2026-05-12T18:00:00.000Z",
    images: [
      "/milan-campus-hero.png",
      "/milan-campus-lobby.png",
      "/milan-campus-office.png"
    ],
    bids: [],
    seller: "Tribunale di Milano",
    lot: "IM-119",
    caseReference: "VJ-IT-2026-031",
    administratorName: "Segreteria Giudiziaria",
    administratorEntity: "Tribunale di Milano",
    occupancyStatus: "Vacant",
    encumbrancesSummary: "Vacant asset; planning easements, heritage checks, and redevelopment assumptions to be confirmed",
    createdBy: "admin-1"
  },
  {
    id: "auc-marselha-hub",
    slug: "hub-industrial-marselha",
    title: "Marseille industrial hub and port corridor",
    location: "Marselha",
    region: "Provence-Alpes-Cote d'Azur",
    country: "Franca",
    jurisdiction: "Tribunal de Commerce de Marseille",
    currency: "EUR",
    categoryId: "infraestruturas",
    status: "aberto",
    saleProcedure: "liquidacao",
    description:
      "Regional-scale industrial and port-adjacent asset in liquidation, with active licences, heavy-duty infrastructure, and strategic access for industrial operators and global traders.",
    executiveSummary: [
      "Rare-scale industrial hub with cross-border relevance and significant logistics and storage optionality.",
      "Liquidation process well suited to demonstrate documentary complexity, licence review, and large-ticket value.",
      "High-impact demo case for industrial buyers seeking scale, infrastructure, and process discipline."
    ],
    highlights: [
      "47 licensed hectares with operating infrastructure in place",
      "Immediate connection to a strategic port corridor",
      "Reserved land and utilities capacity supporting phased expansion"
    ],
    legalNotes: [
      "Sale taking place within a corporate asset liquidation process governed by appointed insolvency professionals.",
      "Full documentation package is released following a qualified expression of interest and data room onboarding."
    ],
    submissionRequirements: [
      "Investor profile and operating rationale",
      "Economic proposal with clear perimeter assumptions",
      "Indicative closing timetable and conditionality schedule"
    ],
    documents: [
      { id: "doc-9", label: "Institutional teaser", type: "teaser", availability: "disponivel" },
      { id: "doc-10", label: "Financial summary", type: "financeiro", availability: "sob-pedido" },
      { id: "doc-13", label: "Concessions and licences map", type: "legal", availability: "disponivel" },
      { id: "doc-14", label: "Data room conditions", type: "nda", availability: "sob-pedido" },
      { id: "doc-19", label: "Infrastructure and utilities plan", type: "teaser", availability: "disponivel" },
      { id: "doc-20", label: "Environmental and licence tracker", type: "legal", availability: "sob-pedido" }
    ],
    basePrice: 8900000,
    currentBid: 9730000,
    reserveMet: true,
    startDate: "2026-03-05T09:00:00.000Z",
    endDate: "2026-04-28T18:00:00.000Z",
    images: [
      "/marseille-hub-hero.png",
      "/marseille-hub-port.png",
      "/marseille-hub-interior.png"
    ],
    bids: [
      { id: "bid-6", userId: "admin-1", amount: 9300000, createdAt: "2026-03-15T13:10:00.000Z" },
      { id: "bid-7", userId: "user-1", amount: 9730000, createdAt: "2026-03-23T15:25:00.000Z" }
    ],
    seller: "Atlantic Gate Logistics",
    lot: "IF-044",
    caseReference: "LIQ-FR-2026-077",
    administratorName: "Carla Neves",
    administratorEntity: "Neves Insolvency Partners",
    occupancyStatus: "Operational asset with concessioned areas",
    encumbrancesSummary: "Sector concessions, licence renewals, and operating interfaces currently in force",
    createdBy: "admin-1"
  }
];
