import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { EquipmentForm } from "@/components/dashboard/equipment-form"
import { getSession } from "@/lib/core/server"

export const metadata = { title: "Add Equipment" }

export default async function AddEquipmentPage() {
    const session = await getSession()

    return (
        <PageContainer>
            <PageHeader
                overline="Owner"
                title="Add Equipment"
                subtitle="New listings stay pending until an admin approves them."
            />
            <EquipmentForm
                mode="create"
                owner={{ name: session?.user.name ?? "", email: session?.user.email ?? "" }}
                backHref="/dashboard/owner/equipment"
            />
        </PageContainer>
    )
}