import db from "@/lib/db";
import BannerClient from "./components/client";
import type { BannerColumn } from "./components/columns";
import { format } from "date-fns";

type Params = { storeId: string };

export default async function BannersPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { storeId } = await params;

  const banners = await db.banner.findMany({
    where: { storeId },
    orderBy: { createdAt: "desc" },
  });

  const formattedBanners: BannerColumn[] = banners.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, "MMMM do, yyyy 'at' h:mm a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BannerClient data={formattedBanners} />
      </div>
    </div>
  );
}
