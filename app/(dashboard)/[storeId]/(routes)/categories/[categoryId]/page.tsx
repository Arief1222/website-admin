import db from "@/lib/db";
import { CategoryForm } from "./components/category-form";

type Params = { storeId: string; categoryId: string };

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { storeId, categoryId } = await params;

  const [category, banners] = await Promise.all([
    db.category.findUnique({ where: { id: categoryId } }),
    db.banner.findMany({ where: { storeId } }),
  ]);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm banners={banners} initialData={category} />
      </div>
    </div>
  );
}
