export type UserRole = "admin" | "user";

export type AuctionStatus = "aberto" | "a-encerrar" | "agendado" | "encerrado";

export type SaleProcedure =
  | "insolvencia"
  | "liquidacao"
  | "reestruturacao"
  | "venda-judicial"
  | "venda-privada";

export type Category = {
  id: string;
  label: string;
  description: string;
};

export type User = {
  id: string;
  name: string;
  company: string;
  role: UserRole;
  avatar: string;
};

export type Bid = {
  id: string;
  userId: string;
  amount: number;
  createdAt: string;
};

export type DocumentItem = {
  id: string;
  label: string;
  type: "teaser" | "caderno-encargos" | "avaliacao" | "legal" | "nda" | "financeiro";
  availability: "disponivel" | "sob-pedido";
};

export type Auction = {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  country: string;
  jurisdiction: string;
  currency: "EUR";
  categoryId: string;
  status: AuctionStatus;
  saleProcedure: SaleProcedure;
  description: string;
  executiveSummary: string[];
  highlights: string[];
  legalNotes: string[];
  submissionRequirements: string[];
  documents: DocumentItem[];
  basePrice: number;
  currentBid: number;
  reserveMet: boolean;
  endDate: string;
  startDate: string;
  images: string[];
  bids: Bid[];
  seller: string;
  lot: string;
  caseReference: string;
  administratorName: string;
  administratorEntity: string;
  occupancyStatus: string;
  encumbrancesSummary: string;
  createdBy: string;
};

export type CartItem = {
  id: string;
  auctionId: string;
  amount: number;
  note?: string;
  createdAt: string;
};

export type SubmissionStatus = "draft" | "submitting" | "success";

export type Submission = {
  id: string;
  userId: string;
  createdAt: string;
  items: CartItem[];
  totalAmount: number;
  status: SubmissionStatus;
};

export type SessionEvent = {
  id: string;
  type: "auction-created";
  auctionId: string;
  createdAt: string;
};

export type NewAuctionInput = {
  title: string;
  description: string;
  categoryId: string;
  basePrice: number;
  location: string;
  region: string;
  country: string;
  jurisdiction: string;
  saleProcedure: SaleProcedure;
  caseReference: string;
  administratorName: string;
  administratorEntity: string;
  occupancyStatus: string;
  encumbrancesSummary: string;
  startDate: string;
  endDate: string;
  images: string[];
  seller: string;
  executiveSummary: string[];
  highlights: string[];
  legalNotes: string[];
  submissionRequirements: string[];
};
