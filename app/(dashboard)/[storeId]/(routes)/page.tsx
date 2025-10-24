import db from "@/lib/db";

type Params = { storeId: string };

export default async function DashboardPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { storeId } = await params;

  const store = await db.store.findFirst({
    where: {
      id: storeId,
    },
  });

  return (
    <div>
      Active Store : {store?.name}
    </div>
  );
}
