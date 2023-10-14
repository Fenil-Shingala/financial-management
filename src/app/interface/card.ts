import { Transaction } from './transaction';

export interface Card {
  cardTransaction: Transaction[];
  holderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardAmount: number;
  id: number;
}
