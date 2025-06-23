'use client';

import { use } from "react";
import { ApiAlert } from "./api-alert";
import { useParams } from "next/navigation";
import { useOrigin } from "@/hooks/use-origin";

interface ApiListPrps {
    nameIndicator: string;
    idIndicator: string;
}

export const ApiList: React.FC<ApiListPrps> = ({
    nameIndicator,
    idIndicator
}) => {

    const params = useParams();
    const origin = useOrigin();

    const baseUrl = `${origin}/api/${params.storeId}`;
    return (
        <>
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${nameIndicator}`}
            />
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${nameIndicator}/${idIndicator}`}
            />
            <ApiAlert
                title="POST"
                variant="admin"
                description={`${baseUrl}/${nameIndicator}`}
            />
            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${nameIndicator}/${idIndicator}`}
            />
            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${nameIndicator}/${idIndicator}`}
            />
        </>
    )
}