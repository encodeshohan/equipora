import { notFound } from "next/navigation"

import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EquipmentForm } from "@/components/dashboard/equipment-form"
import { getManagedEquipment } from "@/lib/api/equipment"
import { getSession } from "@/lib/core/server"

export const metadata = { title: "Update Equipment" }

export default async function EditEquipmentPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const [session, item] = await Promise.all([getSession(), getManagedEquipment(id)])
    if (!item) notFound()

    return (
        <PageContainer>
            <PageHeader
                overline="Owner"
                title="Update Equipment"
                subtitle={item.name}
            />
            <EquipmentForm
                mode="edit"
                initial={item}
                owner={{ name: session?.user.name ?? "", email: session?.user.email ?? "" }}
                backHref="/dashboard/owner/equipment"
            />
        </PageContainer>
    )
}