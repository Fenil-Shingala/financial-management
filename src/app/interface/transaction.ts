export interface Transaction {
  amountType: boolean;
  title: string;
  amount: number | string;
  time: string;
  id: string;
  receivedFrom: string;
  category: string;
  paidTo: string;
}
