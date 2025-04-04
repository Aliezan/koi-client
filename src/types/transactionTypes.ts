export enum TransactionOrderBy {
  TRANSACTION_ID = "transaction_id",
  AMOUNT = "amount",
  TYPE = "type",
  STATUS = "status",
  CREATED_AT = "created_at",
  UPDATED_AT = "updated_at",
  USER_ID = "user_id",
}

export interface TransactionFilters {
  userId?: string;
  type?: string;
  username?: string;
  status?: TransactionStatus;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  orderBy?: TransactionOrderBy;
  order?: "ASC" | "DESC";
}
export interface FetchAllTransactionsParams extends TransactionFilters {
  token: string;
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  status: string;
  message: string;
  data: T[];
  count: number;
  page: number;
  limit: number;
}

export type CreateTransactionBody = {
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
};

export type UpdateTransactionBody = {
  status?: TransactionStatus;
};

interface User {
  user_id: string;
  username: string;
}

interface Wallet {
  wallet_id: string;
  balance: string;
  user: User;
}

export interface Transaction {
  transaction_id: string;
  amount: string;
  type: TransactionType;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
  wallet: Wallet;
  proof_of_payment?: string;
  admin_id: string;
  admin: User;
}

export type PaginatedTransactionsResponse = PaginatedResponse<Transaction>;

export type TransactionByIDResponse = {
  data: Transaction;
};

export interface TransactionTableData {
  transaction_id: string;
  amount: string;
  type: string;
  status: string;
  created_at: string;
  updated_at: string;
  user: string;
}

// Adjusted TransactionType enum to include types that were defined in your model
export enum TransactionType {
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  TRANSFER = "TRANSFER",
  PARTICIPATE = "PARTICIPATE",
  REFUND = "REFUND",
}

// Adjusted TransactionStatus enum to match your model (added REJECTED and APPROVED)
export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export const transformTransactionToTableData = (
  transaction: Transaction | null | undefined,
): TransactionTableData => {
  if (!transaction) {
    return {
      transaction_id: "",
      amount: "0",
      type: "",
      status: "",
      created_at: "",
      updated_at: "",
      user: "N/A",
    };
  }

  return {
    transaction_id: transaction.transaction_id ?? "",
    amount: transaction.amount ?? "0",
    type: transaction.type ?? "",
    status: transaction.status ?? "",
    created_at: transaction.created_at ?? "",
    updated_at: transaction.updated_at ?? "",
    user: transaction.wallet?.user.username ?? "N/A",
  };
};
