"use client";

import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminControlsViewModel from "./AdminControls.viewModel";

type AdminControlsProps = {
  auctionId: string;
  bid_increment: string;
  reserve_price: string;
  koiId: string;
  token: string;
};

const AdminControls: FC<AdminControlsProps> = ({
  auctionId,
  bid_increment,
  reserve_price,
  koiId,
  token,
}) => {
  const { handleCancelAuction, pendingCancel, open, setOpen } =
    AdminControlsViewModel(token);

  return (
    <div className="mb-3 mt-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Auction Management
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Ban className="mr-2 h-4 w-4" />
              Cancel Auction
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will immediately cancel the auction and notify all
                participants. This action cannot be reversed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleCancelAuction(
                    auctionId,
                    bid_increment,
                    reserve_price,
                    koiId,
                  );
                }}
                disabled={pendingCancel}
              >
                {pendingCancel ? "Processing..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminControls;
