"use client";

import type React from "react";
import { forwardRef, useImperativeHandle } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import KoiAuctionFormViewModel from "./KoiAuctionForm.viewModel";
import { MinimalTiptapEditor } from "@/components/shared/minimal-tiptap";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { FormHandle } from "@/types/global.types";

type KoiAuctionFormProps = {
  token: string;
  id: string;
  operation: "create" | "update" | "republish";
  onSubmitSuccess?: () => void; // Add this prop
  submitButton?: React.ReactNode; // Add this
};

const KoiAuctionForm = forwardRef<FormHandle, KoiAuctionFormProps>(
  ({ token, id, operation, onSubmitSuccess, submitButton }, ref) => {
    const {
      form,
      onSubmit,
      pendingCreate: isSubmitting,
      pendingUpdate,
      formatCurrency,
      isUpdate,
      isLoading,
    } = KoiAuctionFormViewModel(token, id, operation, onSubmitSuccess);

    useImperativeHandle(ref, () => ({
      submit: async () => {
        return new Promise((resolve, reject) => {
          try {
            // Create a safe wrapper around form submission
            const handleSubmit = form.handleSubmit(async (data) => {
              try {
                await onSubmit(data);
                resolve(true);
              } catch (error) {
                reject(error);
              }
            });

            // Call the submission function with a mock event
            handleSubmit({
              preventDefault: () => {},
              stopPropagation: () => {},
            } as any);
          } catch (error) {
            reject(error);
          }
        });
      },

      validateForm: async () => {
        try {
          // Ensure all fields are validated
          const result = await form.trigger();
          console.log("Form validation result:", result);
          return result;
        } catch (error) {
          console.error("Form validation error:", error);
          return false;
        }
      },

      getValues: () => {
        const values = form.getValues();
        console.log("Form values retrieved:", values);
        return values;
      },

      submitWithData: async (data) => {
        try {
          console.log("Submitting with data:", data);
          await onSubmit(data);
          return true;
        } catch (error) {
          console.error("Error submitting with data:", error);
          throw error;
        }
      },
    }));

    // Show loading state while fetching auction data for updates
    if (isUpdate && isLoading) {
      return (
        <div className="space-y-6">
          <div className="rounded-xl border p-4 dark:border-neutral-700">
            <h2 className="font-semibold">Auction Details</h2>
            <div className="mt-4 space-y-4">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                ))}
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }

    // Update the form element to properly handle submission
    return (
      // Ensure FormProvider is wrapping everything that uses form context
      <Form {...form}>
        <form
          onSubmit={(e) => {
            // Always prevent default form submission
            e.preventDefault();
            e.stopPropagation();
          }}
          className="space-y-6"
        >
          {" "}
          <div className="rounded-xl border p-4 dark:border-neutral-700">
            <h2 className="font-semibold">Auction Details</h2>
            <div className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Auction Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter auction title"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    {!form.formState.errors.title && (
                      <FormDescription>A title for the auction</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Auction Description
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter auction description"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    {!form.formState.errors.description && (
                      <FormDescription>
                        A short description of the auction
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rich_description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">Description</FormLabel>
                    <FormControl>
                      <MinimalTiptapEditor
                        {...field}
                        value={field.value || ""}
                        throttleDelay={0}
                        className={cn("h-full min-h-56 w-full rounded-xl", {
                          "border-destructive focus-within:border-destructive":
                            form.formState.errors.description,
                        })}
                        editorContentClassName="overflow-auto h-full flex grow"
                        placeholder="Type your description here..."
                        editable={true}
                        editorClassName="focus:outline-none px-5 py-4 h-full grow"
                        immediatelyRender={false}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="item"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground">
                      Koi Item ID
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled
                      />
                    </FormControl>
                    {!form.formState.errors.item && (
                      <FormDescription>
                        The ID of the Koi Item to be auctioned
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="buynow_price"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">
                      Buy Now Price
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          Rp
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter buy now price"
                          {...field}
                          className="pl-9"
                          value={
                            field.value === 0 ? "" : formatCurrency(field.value)
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/\./g, "");
                            if (/^\d*$/.test(value)) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    {!form.formState.errors.buynow_price && (
                      <FormDescription>
                        The buy now price for the auction
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="participation_fee"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">
                      Participation Fee
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          Rp
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter participation fee"
                          {...field}
                          className="pl-9"
                          value={
                            field.value === 0 ? "" : formatCurrency(field.value)
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/\./g, "");
                            if (/^\d*$/.test(value)) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    {!form.formState.errors.participation_fee && (
                      <FormDescription>
                        The participation fee for the user to join auction
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bid_starting_price"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">
                      Minimum Starting Bid Price
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          Rp
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter starting bid price"
                          {...field}
                          className="pl-9"
                          value={
                            field.value === 0 ? "" : formatCurrency(field.value)
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/\./g, "");
                            if (/^\d*$/.test(value)) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    {!form.formState.errors.buynow_price && (
                      <FormDescription>
                        The minimum price user to bid the auction
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bid_increment"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-foreground">
                      Bid Increment
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2">
                          Rp
                        </span>
                        <Input
                          type="text"
                          placeholder="Enter bid increment"
                          {...field}
                          className="pl-9"
                          value={
                            field.value === 0 ? "" : formatCurrency(field.value)
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(/\./g, "");
                            if (/^\d*$/.test(value)) {
                              field.onChange(Number(value));
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    {!form.formState.errors.bid_increment && (
                      <FormDescription>
                        The minimum amount that must be added to the current bid
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {submitButton !== null &&
            (submitButton ?? (
              <Button
                type="button" // Change to type="button" to prevent form submission
                className="w-full"
                disabled={isUpdate ? pendingUpdate : isSubmitting}
                onClick={(e) => {
                  e.preventDefault(); // Prevent any default behavior
                  form.handleSubmit(onSubmit)(); // Correctly invoke the submission handler
                }}
              >
                {isUpdate ? (
                  pendingUpdate ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Auction...
                    </>
                  ) : (
                    "Update Auction"
                  )
                ) : isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding to Auction...
                  </>
                ) : operation === "create" ? (
                  "Add to Auction"
                ) : (
                  "Update Auction"
                )}
              </Button>
            ))}
        </form>
      </Form>
    );
  },
);

KoiAuctionForm.displayName = "KoiAuctionForm";

export default KoiAuctionForm;
