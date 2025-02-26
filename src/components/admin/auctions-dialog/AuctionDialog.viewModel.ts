import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUpdateAuction } from "@/server/auction/updateAuction/mutations";
import { UpdateAuctionBody, AuctionStatus } from "@/types/auctionTypes";
import { toast } from "sonner";
import useDeleteAuction from "@/server/auction/deleteAuction/mutations";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateKoi from "@/server/koi/updateKoi/mutations";
import { KoiStatus, PaginatedResponse, Koi } from "@/types/koiTypes";
import { getErrorMessage } from "@/lib/handleApiError";

const auctionFormSchema = z
  .object({
    startDateTime: z
      .date({
        required_error: "Start date and time is required",
      })
      .refine(
        (date) => {
          const now = new Date();
          return date > now;
        },
        {
          message: "Start time must be in the future",
        },
      ),
    endDateTime: z
      .date({
        required_error: "End date and time is required",
      })
      .refine(
        (date) => {
          const now = new Date();
          return date > now;
        },
        {
          message: "End time must be in the future",
        },
      ),
  })
  .superRefine((data, ctx) => {
    const diffInMinutes =
      (data.endDateTime.getTime() - data.startDateTime.getTime()) / (1000 * 60);

    if (data.endDateTime <= data.startDateTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End time must be after start time",
        path: ["endDateTime"],
      });
    }

    if (diffInMinutes < 60) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Auction duration must be at least 1 hour",
        path: ["endDateTime"],
      });
    }
  });

type AuctionFormData = z.infer<typeof auctionFormSchema>;

export const useAuctionDialog = (token: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();
  const form = useForm<AuctionFormData>({
    resolver: zodResolver(auctionFormSchema),
    defaultValues: {
      startDateTime: new Date(),
      endDateTime: new Date(),
    },
  });

  const { mutate: updateMutate, isPending: pendingUpdate } = useUpdateAuction(
    token,
    queryClient,
  );
  const { mutate: deleteMutate, isPending: pendingDelete } = useDeleteAuction(
    token,
    queryClient,
  );

  const { mutate: updateKoiStatus, isPending: pendingUpdateKoiStatus } =
    useUpdateKoi(queryClient);

  const handlePublishAuction = async (
    auctionId: string,
    bid_increment: string,
    reserve_price: string,
  ) => {
    const { startDateTime, endDateTime } = form.getValues();

    const data: UpdateAuctionBody = {
      status: AuctionStatus.PUBLISHED,
      start_datetime: startDateTime.toISOString().replace(/\.\d{3}Z$/, "Z"),
      end_datetime: endDateTime.toISOString().replace(/\.\d{3}Z$/, "Z"),
      bid_increment,
      reserve_price,
    };

    updateMutate(
      { auctionId, data },
      {
        onSuccess: () => {
          toast.success("Auction published");
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to publish auction");
        },
      },
    );
  };

  const handleUnpublishAuction = async (
    auctionId: string,
    bid_increment: string,
    reserve_price: string,
  ) => {
    const data: UpdateAuctionBody = {
      status: AuctionStatus.DRAFT,
      bid_increment,
      reserve_price,
    };

    updateMutate(
      { auctionId, data },
      {
        onSuccess: () => {
          toast.success("Auction unpublished");
          onSuccess?.();
        },
        onError: () => {
          toast.error("Failed to unpublish auction");
        },
      },
    );
  };

  const handleCancelAuction = async (
    auctionId: string,
    bid_increment: string,
    reserve_price: string,
    koiId: string,
  ) => {
    try {
      await queryClient.cancelQueries({ queryKey: ["allAuctions"] });
      await queryClient.cancelQueries({ queryKey: ["koiData"] });

      const previousAuctions =
        queryClient.getQueryData<any[]>(["allAuctions"]) ?? [];
      const previousKoiData = queryClient.getQueryData<PaginatedResponse<Koi>>([
        "koiData",
      ]);

      // Store original koi status for potential API rollback
      const originalKoiStatus = previousKoiData?.data?.find(
        (koi) => koi.id === koiId,
      )?.status;

      // Perform optimistic updates
      if (previousKoiData?.data) {
        queryClient.setQueryData<PaginatedResponse<Koi>>(["koiData"], (old) => {
          if (!old?.data) return old ?? previousKoiData;
          return {
            ...old,
            data: old.data.map((koi) =>
              koi.id === koiId ? { ...koi, status: KoiStatus.AUCTION } : koi,
            ),
          };
        });
      }

      queryClient.setQueryData<any[]>(["allAuctions"], (old) => {
        return (old ?? []).map((auction) =>
          auction.id === auctionId
            ? {
                ...auction,
                status: AuctionStatus.CANCELLED,
                bid_increment,
                reserve_price,
              }
            : auction,
        );
      });

      let koiUpdateSuccess = false;

      try {
        // First update koi status
        await new Promise<void>((resolve, reject) =>
          updateKoiStatus(
            {
              koiId,
              koiStatus: KoiStatus.AUCTION,
            },
            {
              onSuccess: () => {
                koiUpdateSuccess = true;
                resolve();
              },
              onError: reject,
            },
          ),
        );

        // Then try to update auction status
        await new Promise<void>((resolve, reject) =>
          updateMutate(
            {
              auctionId,
              data: {
                status: AuctionStatus.CANCELLED,
                bid_increment,
                reserve_price,
              },
            },
            {
              onSuccess: resolve,
              onError: (error) => {
                // If auction update fails but koi was updated, revert koi status
                if (koiUpdateSuccess && originalKoiStatus) {
                  updateKoiStatus(
                    {
                      koiId,
                      koiStatus: originalKoiStatus,
                    },
                    {
                      onSettled: () => reject(error),
                    },
                  );
                } else {
                  reject(error);
                }
              },
            },
          ),
        );

        toast.success("Auction cancelled");
        onSuccess?.();
      } catch (error) {
        // Rollback optimistic updates
        queryClient.setQueryData(["allAuctions"], previousAuctions);
        queryClient.setQueryData(["koiData"], previousKoiData);
        throw error;
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error("Operation failed to execute", error);
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["allAuctions"] }),
        queryClient.invalidateQueries({ queryKey: ["koiData"] }),
      ]);
    }
  };

  const handleDeleteAuction = async (auctionId: string, koiId: string) => {
    try {
      await queryClient.cancelQueries({ queryKey: ["allAuctions"] });
      await queryClient.cancelQueries({ queryKey: ["koiData"] });

      const previousAuctions =
        queryClient.getQueryData<any[]>(["allAuctions"]) ?? [];
      const previousKoiData = queryClient.getQueryData<PaginatedResponse<Koi>>([
        "koiData",
      ]);

      // Store original koi status for potential API rollback
      const originalKoiStatus = previousKoiData?.data?.find(
        (koi) => koi.id === koiId,
      )?.status;

      // Perform optimistic updates
      if (previousKoiData?.data) {
        queryClient.setQueryData<PaginatedResponse<Koi>>(["koiData"], (old) => {
          if (!old?.data) return old ?? previousKoiData;
          return {
            ...old,
            data: old.data.map((koi) =>
              koi.id === koiId ? { ...koi, status: KoiStatus.AUCTION } : koi,
            ),
          };
        });
      }

      queryClient.setQueryData<any[]>(["allAuctions"], (old) => {
        return (old ?? []).filter((auction) => auction.id !== auctionId);
      });

      let koiUpdateSuccess = false;

      try {
        // First update koi status
        await new Promise<void>((resolve, reject) =>
          updateKoiStatus(
            {
              koiId,
              koiStatus: KoiStatus.AUCTION,
            },
            {
              onSuccess: () => {
                koiUpdateSuccess = true;
                resolve();
              },
              onError: reject,
            },
          ),
        );

        // Then try to delete auction
        await new Promise<void>((resolve, reject) =>
          deleteMutate(auctionId, {
            onSuccess: resolve,
            onError: (error) => {
              // If delete fails but koi was updated, we need to revert koi status
              if (koiUpdateSuccess && originalKoiStatus) {
                updateKoiStatus(
                  {
                    koiId,
                    koiStatus: originalKoiStatus,
                  },
                  {
                    onSettled: () => reject(error),
                  },
                );
              } else {
                reject(error);
              }
            },
          }),
        );

        toast.success("Auction deleted");
        onSuccess?.();
      } catch (error) {
        // Rollback optimistic updates
        queryClient.setQueryData(["allAuctions"], previousAuctions);
        queryClient.setQueryData(["koiData"], previousKoiData);
        throw error;
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
      console.error("Operation failed to execute", error);
    } finally {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["allAuctions"] }),
        queryClient.invalidateQueries({ queryKey: ["koiData"] }),
      ]);
    }
  };

  const isDeleting = pendingDelete || pendingUpdateKoiStatus;
  const isCanceling = pendingUpdate || pendingUpdateKoiStatus;

  return {
    form,
    handleDeleteAuction,
    handlePublishAuction,
    handleUnpublishAuction,
    handleCancelAuction,
    pendingDelete: isDeleting,
    pendingCancel: isCanceling,
    pendingUpdate,
  };
};
