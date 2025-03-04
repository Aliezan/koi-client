import { useQuery } from "@tanstack/react-query";
import { PaginatedResponse, Koi } from "@/types/koiTypes";
import axios from "axios";

interface FetchKoiParams {
  page?: number;
  per_page?: number;
}

const fetchKoiData = async ({
  page = 1,
  per_page = 10,
}: FetchKoiParams = {}) => {
  const { data } = await axios.get<PaginatedResponse<Koi>>(
    `${process.env.NEXT_PUBLIC_APPLICATION_URL}/koi?page=${page}&per_page=${per_page}&status=auction`,
  );

  return data;
};

const useGetKoiData = (params: FetchKoiParams = {}) =>
  useQuery({
    queryKey: ["koiData", params],
    queryFn: () => fetchKoiData(params),
  });

export default useGetKoiData;
