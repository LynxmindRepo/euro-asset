import type { Language } from "@/features/preferences/language-context";

// Sentences produced by the simulated AI Cost Estimator, per language. Place names, amounts and
// distances are passed in already localized/formatted.

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);
const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/** French needs the right preposition before a country name: "en France", "au Portugal", "aux Pays-Bas". */
function frIn(country: string) {
  if (country === "Pays-Bas") return "aux Pays-Bas";
  if (["Portugal", "Danemark", "Royaume-Uni", "Luxembourg"].includes(country)) return `au ${country}`;
  return `en ${country}`;
}

type EstimatorCopy = {
  question: (country: string, currency: string) => string;
  recalculate: (country: string, currency: string) => string;
  caption: (currency: string) => string;
  estimating: string;
  thinking: string;
  ready: (total: string) => string;
  askingPrice: string;
  setBySeller: string;
  transport: string;
  ferry: string;
  ferryDetail: string;
  transferProperty: string;
  transferLegal: string;
  transferDetail: (percent: string, country: string) => string;
  registrationDomestic: string;
  registration: (country: string) => string;
  registrationDetailDomestic: string;
  registrationDetail: string;
  customs: string;
  customsDetail: (country: string) => string;
  fx: string;
  fxDetail: (percent: string) => string;
  modeVehicles: (count: number) => string;
  modeLowLoader: (weight: string) => string;
  modeTrucks: (trucks: number, weight: string) => string;
  sentenceVehicles: (count: number) => string;
  sentenceLowLoader: string;
  sentenceTrucks: (trucks: number) => string;
  stepRead: string;
  stepTransfer: (country: string) => string;
  stepRoute: (from: string, to: string, distance: string) => string;
  stepRegistration: (domestic: boolean, country: string) => string;
  stepCustoms: string;
  stepFx: (currency: string, rate: string) => string;
  stepTotal: string;
  qNoTransport: string;
  aNoTransport: (city: string, property: boolean, percent: string, country: string, amount: string) => string;
  qTransport: string;
  aTransport: (city: string, distance: string, buyerCity: string, weight: string, sentence: string, amount: string, ferry: string | null) => string;
  qRegistration: string;
  aRegistrationDomestic: (country: string, fee: string) => string;
  aRegistration: (country: string, fee: string, total: string | null, count: number) => string;
  qEstimate: string;
  aEstimate: string;
  summary: (immovable: boolean, title: string, country: string, total: string, price: string, extras: string, biggest: { label: string; amount: string } | null) => string;
};

const en: EstimatorCopy = {
  question: (country, currency) => `What's the total cost to bring it to ${country}, in ${currency}?`,
  recalculate: (country, currency) => `Recalculate for ${country} in ${currency}`,
  caption: (currency) => `Estimated total cost breakdown in ${currency}`,
  estimating: "Estimating the total cost…",
  thinking: "Thinking",
  ready: (total) => `Estimate ready. Total about ${total}.`,
  askingPrice: "Asking price",
  setBySeller: "Set by the Disposal Partner",
  transport: "Transport",
  ferry: "Ferry crossing",
  ferryDetail: "Sea crossing to or from the islands",
  transferProperty: "Transfer taxes and notary",
  transferLegal: "Legal and transfer costs",
  transferDetail: (percent, country) => `≈${percent}% in ${country}`,
  registrationDomestic: "Ownership transfer",
  registration: (country) => `Re-registration in ${country}`,
  registrationDetailDomestic: "Change of registered owner",
  registrationDetail: "Plates, inspection and fees",
  customs: "Customs clearance",
  customsDetail: (country) => `Import VAT and duties in ${country} not included`,
  fx: "Currency conversion",
  fxDetail: (percent) => `≈${percent}% bank spread on the price`,
  modeVehicles: (count) => (count > 1 ? `${count} vehicles, driven or on a car transporter` : "Driven or on a car transporter"),
  modeLowLoader: (weight) => `Low-loader for ${weight}`,
  modeTrucks: (trucks, weight) => `${trucks} truck${trucks > 1 ? "s" : ""} for ${weight}`,
  sentenceVehicles: (count) =>
    count > 1 ? `the ${count} vehicles are driven or carried on a car transporter` : "it is driven or carried on a car transporter",
  sentenceLowLoader: "it needs a low-loader for heavy machinery",
  sentenceTrucks: (trucks) => `it fits on ${trucks === 1 ? "one standard truck" : `${trucks} standard trucks`}`,
  stepRead: "Reading the listing and its specifications",
  stepTransfer: (country) => `Checking transfer costs for assets located in ${country}`,
  stepRoute: (from, to, distance) => `Calculating the road route ${from} → ${to} (≈${distance})`,
  stepRegistration: (domestic, country) => `Checking ${domestic ? "ownership transfer" : "re-registration"} rules in ${country}`,
  stepCustoms: "Checking customs formalities outside the EU",
  stepFx: (currency, rate) => `Converting to ${currency} at an indicative rate (1 EUR = ${rate} ${currency})`,
  stepTotal: "Putting the estimate together",
  qNoTransport: "Why is there no transport cost?",
  aNoTransport: (city, property, percent, country, amount) =>
    `This is an immovable asset in ${city}, so nothing has to be shipped. Instead, the buyer usually pays ${
      property ? "property transfer taxes and notary fees" : "legal and contract-transfer costs"
    } — around ${percent}% of the price in ${country}, which is about ${amount} here.`,
  qTransport: "Explain the transport estimate",
  aTransport: (city, distance, buyerCity, weight, sentence, amount, ferry) =>
    `The asset is in ${city}, about ${distance} by road from ${buyerCity}. Based on its weight (${weight}), I assumed ${sentence}. That comes to roughly ${amount}${
      ferry ? `, plus about ${ferry} for the ferry` : ""
    }. A transport company can give you an exact quote.`,
  qRegistration: "What about registration?",
  aRegistrationDomestic: (country, fee) =>
    `Buyer and asset are both in ${country}, so only an ownership transfer is needed — about ${fee} per item.`,
  aRegistration: (country, fee, total, count) =>
    `Vehicles and some machinery must be re-registered in the buyer's country. In ${country} that typically means new plates, a technical inspection and fees — about ${fee} per item${
      total ? `, so ${total} for this lot of ${count}` : ""
    }.`,
  qEstimate: "Why is this only an estimate?",
  aEstimate:
    "These figures use typical rates for transport, registration and currency exchange, not live quotes. Real costs depend on the carrier, the date, the exact route and local rules — confirm them with the seller and service providers before you buy.",
  summary: (immovable, title, country, total, price, extras, biggest) =>
    `${immovable ? `For a buyer in ${country}, "${title}"` : `Bringing "${title}" to ${country}`} would cost about ${total} in total: ${price} for the asset plus roughly ${extras} in extra costs.${
      biggest ? ` The biggest extra is ${lowerFirst(biggest.label)} (${biggest.amount}).` : ""
    }`
};

const fr: EstimatorCopy = {
  question: (country, currency) => `Quel serait le coût total pour le faire venir ${frIn(country)}, en ${currency} ?`,
  recalculate: (country, currency) => `Recalculer ${frIn(country)} en ${currency}`,
  caption: (currency) => `Détail estimé du coût total en ${currency}`,
  estimating: "Estimation du coût total…",
  thinking: "Réflexion",
  ready: (total) => `Estimation prête. Total d’environ ${total}.`,
  askingPrice: "Prix demandé",
  setBySeller: "Fixé par le Disposal Partner",
  transport: "Transport",
  ferry: "Traversée en ferry",
  ferryDetail: "Traversée maritime vers ou depuis les îles",
  transferProperty: "Droits de mutation et notaire",
  transferLegal: "Frais juridiques et de cession",
  transferDetail: (percent, country) => `≈${percent} % ${frIn(country)}`,
  registrationDomestic: "Changement de propriétaire",
  registration: (country) => `Réimmatriculation ${frIn(country)}`,
  registrationDetailDomestic: "Changement du titulaire",
  registrationDetail: "Plaques, contrôle et frais",
  customs: "Dédouanement",
  customsDetail: (country) => `TVA à l’importation et droits de douane ${frIn(country)} non inclus`,
  fx: "Conversion de devises",
  fxDetail: (percent) => `≈${percent} % d’écart bancaire sur le prix`,
  modeVehicles: (count) => (count > 1 ? `${count} véhicules, conduits ou sur porte-voitures` : "Conduit ou sur porte-voitures"),
  modeLowLoader: (weight) => `Porte-engins pour ${weight}`,
  modeTrucks: (trucks, weight) => `${trucks} camion${trucks > 1 ? "s" : ""} pour ${weight}`,
  sentenceVehicles: (count) =>
    count > 1 ? `les ${count} véhicules sont conduits ou transportés sur porte-voitures` : "le véhicule est conduit ou transporté sur porte-voitures",
  sentenceLowLoader: "ces machines lourdes nécessitent un porte-engins",
  sentenceTrucks: (trucks) => `le lot tient sur ${trucks === 1 ? "un camion standard" : `${trucks} camions standard`}`,
  stepRead: "Lecture de l’annonce et de ses caractéristiques",
  stepTransfer: (country) => `Vérification des frais de cession pour les actifs situés ${frIn(country)}`,
  stepRoute: (from, to, distance) => `Calcul de l’itinéraire routier ${from} → ${to} (≈${distance})`,
  stepRegistration: (domestic, country) =>
    `Vérification des règles de ${domestic ? "changement de propriétaire" : "réimmatriculation"} ${frIn(country)}`,
  stepCustoms: "Vérification des formalités douanières hors UE",
  stepFx: (currency, rate) => `Conversion en ${currency} à un taux indicatif (1 EUR = ${rate} ${currency})`,
  stepTotal: "Calcul de l’estimation finale",
  qNoTransport: "Pourquoi n’y a-t-il pas de frais de transport ?",
  aNoTransport: (city, property, percent, country, amount) =>
    `Il s’agit d’un bien immobile situé à ${city} : rien n’est à transporter. En revanche, l’acheteur paie généralement ${
      property ? "des droits de mutation et des frais de notaire" : "des frais juridiques et de transfert des contrats"
    } — environ ${percent} % du prix ${frIn(country)}, soit environ ${amount} ici.`,
  qTransport: "Expliquez l’estimation du transport",
  aTransport: (city, distance, buyerCity, weight, sentence, amount, ferry) =>
    `L’actif se trouve à ${city}, à environ ${distance} par la route de ${buyerCity}. D’après son poids (${weight}), j’ai considéré que ${sentence}. Cela représente environ ${amount}${
      ferry ? `, plus environ ${ferry} pour le ferry` : ""
    }. Un transporteur pourra vous faire un devis exact.`,
  qRegistration: "Et l’immatriculation ?",
  aRegistrationDomestic: (country, fee) =>
    `L’acheteur et l’actif sont tous deux ${frIn(country)} : un simple changement de propriétaire suffit — environ ${fee} par unité.`,
  aRegistration: (country, fee, total, count) =>
    `Les véhicules et certaines machines doivent être réimmatriculés dans le pays de l’acheteur. ${capitalize(frIn(country))}, cela signifie en général de nouvelles plaques, un contrôle technique et des frais — environ ${fee} par unité${
      total ? `, soit ${total} pour ce lot de ${count}` : ""
    }.`,
  qEstimate: "Pourquoi s’agit-il seulement d’une estimation ?",
  aEstimate:
    "Ces chiffres reposent sur des tarifs habituels de transport, d’immatriculation et de change, pas sur des devis en temps réel. Les coûts réels dépendent du transporteur, de la date, de l’itinéraire exact et des règles locales — confirmez-les auprès du vendeur et des prestataires avant d’acheter.",
  summary: (immovable, title, country, total, price, extras, biggest) =>
    `${immovable ? `Pour un acheteur ${frIn(country)}, « ${title} »` : `Faire venir « ${title} » ${frIn(country)}`} coûterait environ ${total} au total : ${price} pour l’actif, plus environ ${extras} de frais supplémentaires.${
      biggest ? ` Le poste le plus important est : ${lowerFirst(biggest.label)} (${biggest.amount}).` : ""
    }`
};

const sv: EstimatorCopy = {
  question: (country, currency) => `Vad kostar det totalt att ta den till ${country}, i ${currency}?`,
  recalculate: (country, currency) => `Räkna om för ${country} i ${currency}`,
  caption: (currency) => `Uppskattad totalkostnad uppdelad i ${currency}`,
  estimating: "Uppskattar totalkostnaden…",
  thinking: "Tänker",
  ready: (total) => `Uppskattningen är klar. Totalt cirka ${total}.`,
  askingPrice: "Begärt pris",
  setBySeller: "Satt av Disposal Partner",
  transport: "Transport",
  ferry: "Färja",
  ferryDetail: "Sjötransport till eller från öarna",
  transferProperty: "Lagfart och notarie",
  transferLegal: "Juridiska kostnader och överlåtelse",
  transferDetail: (percent, country) => `≈${percent} % i ${country}`,
  registrationDomestic: "Ägarbyte",
  registration: (country) => `Omregistrering i ${country}`,
  registrationDetailDomestic: "Byte av registrerad ägare",
  registrationDetail: "Skyltar, besiktning och avgifter",
  customs: "Tullklarering",
  customsDetail: (country) => `Importmoms och tull i ${country} ingår inte`,
  fx: "Valutaväxling",
  fxDetail: (percent) => `≈${percent} % bankpåslag på priset`,
  modeVehicles: (count) => (count > 1 ? `${count} fordon, körs eller på biltransport` : "Körs eller på biltransport"),
  modeLowLoader: (weight) => `Låglastare för ${weight}`,
  modeTrucks: (trucks, weight) => `${trucks} lastbil${trucks > 1 ? "ar" : ""} för ${weight}`,
  sentenceVehicles: (count) =>
    count > 1 ? `de ${count} fordonen körs eller fraktas på biltransport` : "fordonet körs eller fraktas på biltransport",
  sentenceLowLoader: "det behövs en låglastare för tunga maskiner",
  sentenceTrucks: (trucks) => `det får plats på ${trucks === 1 ? "en vanlig lastbil" : `${trucks} vanliga lastbilar`}`,
  stepRead: "Läser annonsen och dess specifikationer",
  stepTransfer: (country) => `Kontrollerar överlåtelsekostnader för tillgångar i ${country}`,
  stepRoute: (from, to, distance) => `Beräknar vägsträckan ${from} → ${to} (≈${distance})`,
  stepRegistration: (domestic, country) => `Kontrollerar regler för ${domestic ? "ägarbyte" : "omregistrering"} i ${country}`,
  stepCustoms: "Kontrollerar tullformaliteter utanför EU",
  stepFx: (currency, rate) => `Räknar om till ${currency} med en ungefärlig kurs (1 EUR = ${rate} ${currency})`,
  stepTotal: "Sammanställer uppskattningen",
  qNoTransport: "Varför finns det ingen transportkostnad?",
  aNoTransport: (city, property, percent, country, amount) =>
    `Det här är en fast egendom i ${city}, så inget behöver fraktas. Köparen betalar i stället oftast ${
      property ? "lagfart och notarieavgifter" : "juridiska kostnader och avgifter för att överlåta avtal"
    } – runt ${percent} % av priset i ${country}, vilket här blir ungefär ${amount}.`,
  qTransport: "Förklara transportberäkningen",
  aTransport: (city, distance, buyerCity, weight, sentence, amount, ferry) =>
    `Tillgången finns i ${city}, ungefär ${distance} på väg från ${buyerCity}. Utifrån vikten (${weight}) antog jag att ${sentence}. Det blir ungefär ${amount}${
      ferry ? `, plus cirka ${ferry} för färjan` : ""
    }. Ett transportföretag kan ge dig en exakt offert.`,
  qRegistration: "Och registreringen?",
  aRegistrationDomestic: (country, fee) =>
    `Köpare och tillgång finns båda i ${country}, så det räcker med ett ägarbyte – ungefär ${fee} per styck.`,
  aRegistration: (country, fee, total, count) =>
    `Fordon och vissa maskiner måste omregistreras i köparens land. I ${country} innebär det oftast nya skyltar, besiktning och avgifter – ungefär ${fee} per styck${
      total ? `, alltså ${total} för det här partiet på ${count}` : ""
    }.`,
  qEstimate: "Varför är det bara en uppskattning?",
  aEstimate:
    "Beloppen bygger på normala priser för transport, registrering och valutaväxling, inte på aktuella offerter. De verkliga kostnaderna beror på transportör, datum, exakt rutt och lokala regler – bekräfta dem med säljaren och tjänsteleverantörerna innan du köper.",
  summary: (immovable, title, country, total, price, extras, biggest) =>
    `${immovable ? `För en köpare i ${country} skulle ”${title}”` : `Att ta ”${title}” till ${country} skulle`} kosta ungefär ${total} totalt: ${price} för tillgången plus cirka ${extras} i extra kostnader.${
      biggest ? ` Den största extrakostnaden är ${lowerFirst(biggest.label)} (${biggest.amount}).` : ""
    }`
};

export const estimatorCopy: Record<Language, EstimatorCopy> = { en, fr, sv };
