import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { AuctionBody } from "@/types/auctionTypes";
import { useMutation } from "@tanstack/react-query";

const updateAuction = async (
  token: string,
  auctionId: string,
  data: AuctionBody,
) => {
  const { data: response } = await fetchWithAuth.put(
    `/auctions/${auctionId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response;
};

export const useUpdateAuction = (token: string) => {
  return useMutation({
    mutationFn: ({
      auctionId,
      data,
    }: {
      auctionId: string;
      data: AuctionBody;
    }) => updateAuction(token, auctionId, data),
    onError: (error) => {
      console.error("Failed to update auction:", error);
    },
  });
};
