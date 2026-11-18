import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins"

import type { auth } from "@/lib/auth"

// `inferAdditionalFields<typeof auth>` pulls in the server schema so the
// `role` field declared in `lib/auth.ts` is typed here. No baseURL: the auth
// routes live on the same origin as the client.
export const authClient = createAuthClient({
    plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = authClient