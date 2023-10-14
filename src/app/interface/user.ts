import { Card } from './card';
import { Transaction } from './transaction';

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  walletAmout: number;
  id: number;
  cards: Card[];
  walletTransaction: Transaction[];
}
