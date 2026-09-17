export type Gender = 'male' | 'female';

export type OrderStatus = 'fitting1' | 'fitting2' | 'fitting3' | 'finished' | 'delivered';

export type StandardGarment = 
  | 'Suit' 
  | 'Pant' 
  | 'Jacket' 
  | 'Coat' 
  | 'Vest' 
  | 'Shirt' 
  | 'Tie' 
  | 'Blouse' 
  | 'Skirt' 
  | 'Dress';

export interface GarmentItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ShirtMeasurements {
  neck?: string;
  chest?: string;
  shoulderToChest?: string;
  bustSpan?: string;
  waist?: string;
  shoulderToWaist?: string;
  hips?: string;
  shoulders?: string;
  armRight?: string;
  armLeft?: string;
  frontChest?: string;
  back?: string;
  length?: string;
  shortSleeves?: string;
  notes?: string;
}

export interface PantSkirtMeasurements {
  waist?: string;
  hips?: string;
  crotch?: string;
  thigh?: string;
  length?: string;
  bottom?: string;
  skirtLength?: string;
  shortPant?: string;
  notes?: string;
}

export interface JacketCoatVestMeasurements {
  neck?: string;
  chest?: string;
  shoulderToChest?: string;
  bustSpan?: string;
  waist?: string;
  shoulderToWaist?: string;
  hips?: string;
  shoulders?: string;
  armRight?: string;
  armLeft?: string;
  frontChest?: string;
  back?: string;
  length?: string;
  vestLength?: string;
  coatLength?: string;
  notes?: string;
}

export interface CustomerDetails {
  name: string;
  gender: Gender;
  hotel?: string;
  room?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "1834"
  date: string;        // YYYY-MM-DD
  fittingStage: 1 | 2 | 3;
  status: OrderStatus;
  customer: CustomerDetails;
  items: GarmentItem[];
  total: number;
  deposit: number;
  balance: number;
  shirt?: ShirtMeasurements;
  pantSkirt?: PantSkirtMeasurements;
  jacketCoatVest?: JacketCoatVestMeasurements;
  specialRequest?: string; // Special instructions/requests from customer
  fabricNotes?: string;
  deliveryDate?: string;
  fittingDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSettings {
  shopName: string;
  phone: string;
  email: string;
  address: string;
  currency: string;
  unit: 'in' | 'cm';
}
