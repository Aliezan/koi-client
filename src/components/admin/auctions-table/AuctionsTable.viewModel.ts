import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import useGetAllAuctions from "@/server/auction/getAllAuctions/queries";
import {
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  AuctionFilters,
  AuctionOrderBy,
  AuctionStatus,
} from "@/types/auctionTypes";
import { format } from "date-fns";
import { Socket } from "socket.io-client";
import { useAuctionSocket } from "@/hooks/useAuctionSocket";

interface UseAuctionsTableViewModelProps {
  token: string;
  socket: Socket | null;
}

const AuctionsTableViewModel = ({
  token,
  socket,
}: UseAuctionsTableViewModelProps) => {
  useAuctionSocket({ socket });

  const router = useRouter();
  const searchParams = useSearchParams();

  const pageIndex = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("limit")) || 10;
  const startDateFrom = searchParams.get("startDateFrom")
    ? new Date(searchParams.get("startDateFrom")!)
    : undefined;
  const startDateTo = searchParams.get("startDateTo")
    ? new Date(searchParams.get("startDateTo")!)
    : undefined;
  const orderBy =
    (searchParams.get("orderBy") as AuctionOrderBy) ||
    AuctionOrderBy.CREATED_AT;
  const order = (searchParams.get("order") as "ASC" | "DESC") || "DESC";
  const searchColumn = {
    id: searchParams.get("searchColumn") || "title",
    label: searchParams.get("searchColumnLabel") || "Title",
  };
  const status = searchParams.get("status") as AuctionStatus | undefined;

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      return params.toString();
    },
    [searchParams],
  );

  const handleFiltersApply = useCallback(
    (filters: AuctionFilters) => {
      const queryParams = Object.entries({
        status: filters.status,
        startDateFrom: filters.startDateFrom,
        startDateTo: filters.startDateTo,
        orderBy: filters.orderBy,
        order: filters.order,
      }).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>,
      );

      const queryString = createQueryString(queryParams);

      if (queryString) {
        router.push(`?${queryString}`);
      }
    },
    [createQueryString, router],
  );

  const handleResetFilters = useCallback(() => {
    router.push(window.location.pathname);
  }, [router]);

  const setStatus = useCallback(
    (status: AuctionStatus | undefined) => {
      router.push(`?${createQueryString({ status })}`);
    },
    [createQueryString, router],
  );

  const handlePreviousPage = useCallback(() => {
    const newPage = pageIndex - 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [pageIndex, searchParams, router]);

  const handleNextPage = useCallback(() => {
    const newPage = pageIndex + 1;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  }, [pageIndex, searchParams, router]);

  const handlePageSizeChange = useCallback(
    (newSize: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("limit", newSize.toString());
      params.set("page", "1");
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [searchParams, router],
  );

  const setStartDateFrom = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString({
            startDateFrom: format(date, "yyyy-MM-dd"),
          })}`,
        );
      }
    },
    [createQueryString, router],
  );

  const setStartDateTo = useCallback(
    (date?: Date) => {
      if (date) {
        router.push(
          `?${createQueryString({
            startDateTo: format(date, "yyyy-MM-dd"),
          })}`,
        );
      }
    },
    [createQueryString, router],
  );

  const handleSort = useCallback(
    (newOrderBy: AuctionOrderBy) => {
      const params = new URLSearchParams(searchParams.toString());
      const currentOrderBy = params.get("orderBy") as AuctionOrderBy;
      const currentOrder = params.get("order") as "ASC" | "DESC";

      if (newOrderBy === currentOrderBy) {
        params.set("order", currentOrder === "ASC" ? "DESC" : "ASC");
      } else {
        params.set("orderBy", newOrderBy);
        params.set("order", "DESC");
      }
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  const setSearchColumn = useCallback(
    (column: { id: string; label: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("searchColumn", column.id);
      params.set("searchColumnLabel", column.label);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router],
  );

  interface IURLSearchParams {
    koiID: string;
  }

  const updateAuctionURLSearchParams = (
    auctionId: string,
    params: IURLSearchParams,
  ) => {
    const searchParams = new URLSearchParams({
      koiID: params.koiID,
    });

    const url = `/dashboard/auctions/update/${auctionId}?${searchParams.toString()}`;

    return url;
  };

  const {
    data: PaginatedData,
    isLoading,
    isError,
  } = useGetAllAuctions({
    token,
    page: pageIndex,
    limit: pageSize,
    startDateFrom,
    startDateTo,
    orderBy,
    order,
    status,
  });

  return {
    pageIndex,
    pageSize,
    startDateFrom,
    setStartDateFrom,
    startDateTo,
    setStartDateTo,
    orderBy,
    order,
    handleSort,
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
    handleFiltersApply,
    handleResetFilters,
    updateAuctionURLSearchParams,
    handlePageSizeChange,
    handleNextPage,
    handlePreviousPage,
    currentFilters: {
      status,
      startDateFrom: startDateFrom?.toISOString().split("T")[0],
      startDateTo: startDateTo?.toISOString().split("T")[0],
      orderBy,
      order,
    } as AuctionFilters,
    isError,
  };
};

export default AuctionsTableViewModel;
