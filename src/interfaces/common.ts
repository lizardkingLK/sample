export enum ExpenseTypes {
  Earning = "Earning",
  Expense = "Expense",
}

export interface ISummary {
  earnings: string | undefined,
  expenses: string | undefined,
}