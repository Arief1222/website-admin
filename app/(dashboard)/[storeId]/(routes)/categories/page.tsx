import db from "@/lib/db";
import CategoryClient from "./components/client";
import type { CategoryColumn } from "./components/columns"; // type-import
import { format } from "date-fns";

type Params = { storeId: string };

export default async function CategoriesPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { storeId } = await params;

  const categories = await db.category.findMany({
    where: { storeId },
    include: { banner: true },
    orderBy: { createdAt: "desc" },
  });

  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    bannerLabel: item.banner?.label ?? "-", // aman kalau nullable
    createdAt: format(item.createdAt, "MMMM do, yyyy 'at' h:mm a"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
}
