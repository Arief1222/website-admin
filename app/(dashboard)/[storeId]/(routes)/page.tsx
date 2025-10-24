// app/(dashboard)/[storeId]/(routes)/settings/page.tsx
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
// import { SettingsForm } from "./components/settings-form"; // <- aktifkan kalau kamu punya form

type Params = { storeId: string };

export default async function SettingsPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { storeId } = await params;

  const store = await db.store.findFirst({
    where: { id: storeId, userId },
  });

  if (!store) redirect("/");

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <h1 className="text-xl font-semibold">Settings — {store.name}</h1>

        {/* Jika punya komponen form pengaturan, render di sini */}
        {/* <SettingsForm initialData={store} /> */}

        {/* Placeholder aman kalau belum ada form */}
        <div className="rounded-lg border p-4 text-sm text-foreground/80">
          Konfigurasi toko akan muncul di sini.
        </div>
      </div>
    </div>
  );
}
