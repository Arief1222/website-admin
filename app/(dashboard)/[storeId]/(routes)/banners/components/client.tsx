'use client'

import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { Banner } from "@prisma/client";
import { BannerColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface BannerClientProps {
    data : BannerColumn[]
}

const BannerClient: React.FC<BannerClientProps> =  ({
    data
}) => {

    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Banner (${data.length})`}
                    description="Manage your store banners here."

                />

                <Button onClick={() => router.push(`/${params.storeId}/banners/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>

            </div>
            <Separator />
            <DataTable data={data} columns={columns} searchKey="label"/>
            <Heading 
            title="API"
            description="Use the following endpoint to manage banners."

            />
            <Separator />
            <ApiList nameIndicator="banners" idIndicator ="bannerId" />
        </>
    );
}

export default BannerClient;