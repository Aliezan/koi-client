import { useQuery } from "@tanstack/react-query";
import { AuctionByIDResponse } from "@/types/auctionTypes";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const fetchAuctionByID = async (
  id: string,
  token: string,
): Promise<AuctionByIDResponse> => {
  const { data } = await fetchWithAuth.get(`/auctions/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

const useGetAuctionByID = (id: string, token: string) =>
  useQuery({
    queryKey: ["auctionByID", id],
    queryFn: () => fetchAuctionByID(id, token),
  });

export default useGetAuctionByID;
