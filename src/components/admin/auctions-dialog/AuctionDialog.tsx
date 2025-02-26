import React, { FC, ReactNode, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuctionDialog } from "./AuctionDialog.viewModel";
import { TimeInput } from "@/components/ui/time-input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type AuctionAlertDialogProps = {
  operation: "publish" | "delete" | "cancel" | "unpublish";
  bid_increment: string;
  reserve_price: string;
  auction_id: string;
  token: string;
  koiId?: string;
  children: ReactNode;
};

const AuctionDialog: FC<AuctionAlertDialogProps> = ({
  operation,
  bid_increment,
  reserve_price,
  auction_id,
  token,
  koiId,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const {
    form,
    handlePublishAuction,
    handleDeleteAuction,
    handleUnpublishAuction,
    handleCancelAuction,
    pendingCancel,
    pendingDelete,
    pendingUpdate,
  } = useAuctionDialog(token, () => setOpen(false));

  if (operation === "publish") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {children}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Auction</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Start Date and Time</FormLabel>
                    <div className="flex gap-2">
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {format(
                              field.value || new Date(),
                              "dd-MM-yyyy HH:mm",
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value || new Date()}
                            onSelect={(date) => {
                              if (date) {
                                const newDate = new Date(date);
                                const currentValue = field.value || new Date();
                                newDate.setHours(currentValue.getHours());
                                newDate.setMinutes(currentValue.getMinutes());
                                field.onChange(newDate);
                              }
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <TimeInput
                        value={format(field.value || new Date(), "HH:mm")}
                        onChange={(time) => {
                          const [hours, minutes] = time.split(":");
                          const newDate = new Date(field.value || new Date());
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>End Date and Time</FormLabel>
                    <div className="flex gap-2">
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {format(
                              field.value || new Date(),
                              "dd-MM-yyyy HH:mm",
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent align="start" className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                const newDate = new Date(date);
                                if (field.value) {
                                  newDate.setHours(field.value.getHours());
                                  newDate.setMinutes(field.value.getMinutes());
                                }
                                field.onChange(newDate);
                              }
                            }}
                            disabled={(date) => {
                              const startDate = form.getValues("startDateTime");
                              return (
                                date < new Date() ||
                                (startDate && date < startDate)
                              );
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <TimeInput
                        value={field.value ? format(field.value, "HH:mm") : ""}
                        onChange={(time) => {
                          const [hours, minutes] = time.split(":");
                          const newDate = field.value || new Date();
                          newDate.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(newDate);
                        }}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(() =>
                handlePublishAuction(auction_id, bid_increment, reserve_price),
              )}
              disabled={pendingUpdate}
            >
              {pendingUpdate ? "Publishing..." : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (operation === "delete") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {children}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Auction</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete this auction?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              No, keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleDeleteAuction(auction_id, koiId!)}
              disabled={pendingDelete}
            >
              {pendingDelete ? "Processing..." : "Yes, delete it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (operation === "unpublish") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {children}
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unpublish Auction</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to unpublish this auction?
          </p>
          <p className="py-4">
            This auction will be marked as draft and will not be visible to
            users
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              No, keep it
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                handleUnpublishAuction(auction_id, bid_increment, reserve_price)
              }
              disabled={pendingUpdate}
            >
              {pendingUpdate ? "Processing..." : "Yes, unpublish it"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          {children}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Auction</DialogTitle>
        </DialogHeader>
        <p className="py-4">
          Are you sure you want to cancel this auction? This operation is
          irreversible
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            No, keep it
          </Button>
          <Button
            variant="destructive"
            onClick={() =>
              handleCancelAuction(
                auction_id,
                bid_increment,
                reserve_price,
                koiId!,
              )
            }
            disabled={pendingCancel}
          >
            Yes, cancel it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionDialog;
