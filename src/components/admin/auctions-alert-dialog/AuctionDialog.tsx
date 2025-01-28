import React, { FC } from "react";
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
  operation: "start" | "terminate" | "cancel";
  bid_increment: string;
  reserve_price: string;
  auction_id: string;
  token: string;
};

const AuctionDialog: FC<AuctionAlertDialogProps> = ({
  operation,
  bid_increment,
  reserve_price,
  auction_id,
  token,
}) => {
  const [open, setOpen] = React.useState(false);
  const { form, handleUpdateAuction, isPending } = useAuctionDialog(token, () =>
    setOpen(false),
  );

  if (operation === "start") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            Start Auction
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Auction</DialogTitle>
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
            <Button variant="outline">Cancel</Button>
            <Button
              onClick={form.handleSubmit(() =>
                handleUpdateAuction(
                  auction_id,
                  "start",
                  bid_increment,
                  reserve_price,
                ),
              )}
              disabled={isPending}
            >
              {isPending ? "Starting..." : "Start"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (operation === "terminate") {
    return <h1>Test</h1>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Cancel Auction
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Auction</DialogTitle>
        </DialogHeader>
        <p className="py-4">Are you sure you want to cancel this auction?</p>
        <DialogFooter>
          <Button variant="outline">No, keep it</Button>
          <Button variant="destructive">Yes, cancel it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuctionDialog;
