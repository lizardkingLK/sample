export enum ExpenseTypes {
  Earning = "Earning",
  Expense = "Expense",
}

export interface IExpense {
  id: number;
  description: string;
}