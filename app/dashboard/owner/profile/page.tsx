import { PageContainer, PageHeader } from "@/components/dashboard/page-shell"
import { ProfileForm } from "@/components/dashboard/profile-form"
import { getProfile } from "@/lib/api/profile"

export const metadata = { title: "My Profile" }

export default async function OwnerProfilePage() {
    const profile = await getProfile()

    return (
        <PageContainer>
            <PageHeader
                overline="Account"
                title="My Profile"
                subtitle="Update your name, photo, phone and address."
            />
            <ProfileForm profile={profile} />
        </PageContainer>
    )
}