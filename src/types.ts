export interface FloodData {
  "@context": string;
  meta: Meta;
  items: Item[];
}

interface Item {
  "@id": string;
  description: string;
  eaAreaName: string;
  eaRegionName: string;
  floodArea: FloodArea;
  floodAreaID: string;
  isTidal: boolean;
  message: string;
  severity: string;
  severityLevel: number;
  timeMessageChanged: string;
  timeRaised: string;
  timeSeverityChanged: string;
}

interface FloodArea {
  "@id": string;
  county: string;
  notation: string;
  polygon: string;
  riverOrSea: string;
}

interface Meta {
  publisher: string;
  licence: string;
  documentation: string;
  version: string;
  comment: string;
  hasFormat: string[];
  limit: number;
}
