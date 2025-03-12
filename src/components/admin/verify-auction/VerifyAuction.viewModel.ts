"use client";

import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useGetAuctionByID from "@/server/auction/getAuctionByID/queries";
import { useUpdateAuction } from "@/server/auction/updateAuction/mutations";
import { AuctionStatus, Bid } from "@/types/auctionTypes";
import { toast } from "sonner";
import useUpdateKoi from "@/server/koi/updateKoi/mutations";
import { KoiStatus } from "@/types/koiTypes";

export const useVerifyAuctionViewModel = (auctionId: string, token: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useGetAuctionByID(auctionId, token, {
    enabled: !!token,
  });

  const { mutate, isPending } = useUpdateAuction(token, queryClient);
  const { mutateAsync: updateKoiStatus, isPending: pendingUpdateKoiStatus } =
    useUpdateKoi(queryClient);

  // Local state
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [bidToConfirm, setBidToConfirm] = useState<Bid | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const auction = data?.data?.[0];

  const handleSelectBid = useCallback((bid: Bid) => {
    setBidToConfirm(bid);
    setDialogOpen(true);
  }, []);

  const handleVerifyWinner = useCallback(() => {
    if (!bidToConfirm || !auctionId || !auction) {
      setDialogOpen(false);
      return;
    }

    const koiId = auction.item;
    const previousAuction = queryClient.getQueryData(["auction", auctionId]);
    const previousKoi = queryClient.getQueryData(["koiData", koiId]);

    // Optimistically update the auction data
    queryClient.setQueryData(["auction", auctionId], (old: any) => ({
      ...old,
      data: [
        {
          ...old.data[0],
          winner_id: bidToConfirm.user.user_id,
          final_price: bidToConfirm.bid_amount,
          status: AuctionStatus.COMPLETED,
        },
      ],
    }));

    // Optimistically update the koi data
    queryClient.setQueryData(["koiData", koiId], (old: any) => ({
      ...old,
      status: KoiStatus.SOLD,
      buyer_name: bidToConfirm.user.username,
    }));

    new Promise<boolean>((resolve, reject) => {
      updateKoiStatus(
        {
          koiId,
          koiStatus: KoiStatus.SOLD,
          buyerName: bidToConfirm.user.username,
        },
        {
          onSuccess: () => resolve(true),
          onError: (error) => {
            // Revert koi optimistic update on error
            queryClient.setQueryData(["koiData", koiId], previousKoi);
            reject(error);
          },
        },
      );
    })
      .then((koiUpdateResult) => {
        if (koiUpdateResult) {
          mutate(
            {
              auctionId,
              data: {
                winner_id: bidToConfirm.user.user_id,
                final_price: bidToConfirm.bid_amount,
                status: AuctionStatus.COMPLETED,
              },
            },
            {
              onSuccess: () => {
                setSelectedBid(bidToConfirm);
                setUpdateSuccess(true);
                setDialogOpen(false);
                toast.success("Winner verified successfully");

                queryClient.invalidateQueries({
                  queryKey: ["auction", auctionId],
                });
                queryClient.invalidateQueries({ queryKey: ["allAuctions"] });
                queryClient.invalidateQueries({ queryKey: ["koiData"] });
              },
              onError: (error) => {
                queryClient.setQueryData(
                  ["auction", auctionId],
                  previousAuction,
                );
                queryClient.setQueryData(["koiData", koiId], previousKoi);

                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : "Failed to update auction";
                setUpdateError(errorMessage);
                toast.error(errorMessage);
              },
              onSettled: () => {
                if (dialogOpen) {
                  setDialogOpen(false);
                }
              },
            },
          );
        }
      })
      .catch((error) => {
        // Revert both optimistic updates on error
        queryClient.setQueryData(["auction", auctionId], previousAuction);
        queryClient.setQueryData(["koiData", koiId], previousKoi);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update koi status";
        setUpdateError(errorMessage);
        toast.error(errorMessage);
        if (dialogOpen) {
          setDialogOpen(false);
        }
      });
  }, [
    auctionId,
    bidToConfirm,
    dialogOpen,
    mutate,
    queryClient,
    auction,
    updateKoiStatus,
  ]);

  return {
    auction,
    isLoading,
    error:
      error instanceof Error ? error.message : error ? String(error) : null,
    selectedBid,
    bidToConfirm,
    handleSelectBid,
    handleVerifyWinner,
    isUpdating: isPending || pendingUpdateKoiStatus,
    updateSuccess,
    updateError,
    dialogOpen,
    setDialogOpen,
  };
};
