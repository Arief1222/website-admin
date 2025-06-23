'use client'

import { Heading } from "@/components/ui/heading";
import { ApiList } from "@/components/ui/api-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { columns, ProductColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface ProductClientProps {
    data : ProductColumn[]
}

const ProductClient: React.FC<ProductClientProps> =  ({
    data
}) => {

    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Product (${data.length})`}
                    description="Manage your store productss here."

                />

                <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>

            </div>
            <Separator />
            <DataTable data={data} columns={columns} searchKey="name"/>
            <Heading 
            title="API"
            description="Use the following endpoint to manage products."

            />
            <Separator />
            <ApiList nameIndicator="products" idIndicator ="productId" />
        </>
    );
}

export default ProductClient;