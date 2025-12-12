export enum QRQuality {
  Low = 'L',
  Medium = 'M',
  Quartile = 'Q',
  High = 'H',
}

export interface QRConfig {
  text: string;
  fgColor: string;
  bgColor: string;
  quality: QRQuality;
}