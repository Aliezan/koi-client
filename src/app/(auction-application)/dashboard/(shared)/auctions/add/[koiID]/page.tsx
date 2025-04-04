import React from "react";
import KoiAuctionForm from "@/components/admin/koi-auction-form/KoiAuctionForm";
import KoiDetails from "@/components/admin/koi-details/KoiDetails";
import { getServerSession } from "@/lib/serverSession";

const AddAuctionPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ koiID: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const koiID = (await params).koiID;
  const {
    koiCode = "",
    nickname = "",
    gender = "",
    breeder = "",
    variety = "",
    size = "",
  } = await searchParams;

  const koiData = {
    code: koiCode as string,
    nickname: nickname as string,
    gender: gender as string,
    breeder: breeder as string,
    variety: variety as string,
    size: size as string,
  };

  const session = await getServerSession();
  const token = session?.user.accessToken ?? "";

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Add to Auction
        </h1>
      </div>
      <div className="grid gap-4 md:gap-6 lg:min-h-[36rem] lg:grid-cols-2">
        <div className="flex h-full flex-col">
          <KoiDetails koiID={koiID} koiData={koiData} />
        </div>
        <div className="flex h-full flex-col">
          <KoiAuctionForm id={koiID} token={token} operation="create" />
        </div>
      </div>
    </div>
  );
};

export default AddAuctionPage;
