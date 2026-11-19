import { notFound } from "next/navigation"

import { EquipmentForm } from "@/components/dashboard/equipment-form"
import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { getManagedEquipment } from "@/lib/api/equipment"

export const metadata = { title: "Update Equipment" }

export default async function AdminEditEquipmentPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const item = await getManagedEquipment(id)
    if (!item) notFound()

    return (
        <PageContainer>
            <PageHeader overline="Admin" title="Update Equipment" subtitle={item.name} />
            <EquipmentForm
                mode="edit"
                initial={item}
                owner={{ name: item.ownerName, email: item.ownerEmail ?? "" }}
                backHref="/dashboard/admin/equipment"
                resetsToPending={false}
            />
        </PageContainer>
    )
}