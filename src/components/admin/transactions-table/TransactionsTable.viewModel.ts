import { useRouter } from "next/navigation";
import { useState } from "react";
import useGetAllTransactions from "@/server/transaction/getAllTransactions/queries"; // Adjust based on actual query hook path
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { TransactionOrderBy } from "@/types/transactionTypes"; // Adjust based on actual path
import { TransactionStatus } from "@/types/transactionTypes"; // Adjust based on actual path

const TransactionsTableViewModel = (token: string) => {
  const router = useRouter();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDateFrom, setStartDateFrom] = useState<Date | undefined>();
  const [startDateTo, setStartDateTo] = useState<Date | undefined>();
  const [orderBy, setOrderBy] = useState<TransactionOrderBy>(
    TransactionOrderBy.CREATED_AT,
  );
  const [order, setOrder] = useState<"ASC" | "DESC">("DESC");
  const [searchColumn, setSearchColumn] = useState<{
    id: string;
    label: string;
  }>({
    id: "transaction_id",
    label: "Transaction ID",
  });
  const [status, setStatus] = useState<TransactionStatus | undefined>(
    undefined,
  );

  const { data: PaginatedData, isLoading } = useGetAllTransactions({
    token,
    page: pageIndex,
    limit: pageSize,
    startDateFrom,
    startDateTo,
    orderBy,
    order,
    status, // Add status to query params
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  return {
    router,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    startDateFrom,
    setStartDateFrom,
    startDateTo,
    setStartDateTo,
    orderBy,
    setOrderBy,
    order,
    setOrder,
    searchColumn,
    setSearchColumn,
    PaginatedData,
    isLoading,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    status,
    setStatus,
  };
};

export default TransactionsTableViewModel;
