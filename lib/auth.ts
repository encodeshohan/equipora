import { APIError, createAuthMiddleware } from "better-auth/api"
import { getPasswordError } from "@/lib/validators"
import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient, ObjectId } from "mongodb"
import { jwt } from "better-auth/plugins"

const mongoUri = process.env.MONGODB_URI

if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in .env.local")
}

// One MongoClient per server process (survives hot reloads in dev).
const globalForMongo = globalThis as unknown as { equiporaMongo?: MongoClient }
const client = globalForMongo.equiporaMongo ?? new MongoClient(mongoUri)

if (process.env.NODE_ENV !== "production") {
    globalForMongo.equiporaMongo = client
}

// Same database as the Express server.
const db = client.db("equiporadb")

const googleEnabled = Boolean(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
)

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    trustedOrigins: (process.env.TRUSTED_ORIGINS ?? "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },
    user: {
        additionalFields: {
            role: {
                type: ["customer", "owner", "admin"],
                required: false,
                input: true,
                defaultValue: "customer",
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                // Sign-up may ask for "owner"; everything else (including "admin")
                // is forced to "customer". Admins are only made from the dashboard.
                before: async (user) => ({
                    data: {
                        ...user,
                        role: user.role === "owner" ? "owner" : "customer",
                    },
                }),
            },
        },
        session: {
            create: {
                // Suspended accounts cannot start a new session.
                before: async (session) => {
                    const userId = String(session.userId)
                    if (!/^[a-f\d]{24}$/i.test(userId)) return

                    const user = await db
                        .collection("user")
                        .findOne({ _id: new ObjectId(userId) }, { projection: { banned: 1 } })

                    if (user?.banned) {
                        throw new APIError("FORBIDDEN", {
                            message: "This account has been suspended.",
                        })
                    }
                },
            },
        },
    },
    // Server-side password rules: the form check alone can be bypassed.
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path !== "/sign-up/email") return
            const error = getPasswordError(ctx.body?.password)
            if (error) {
                throw new APIError("BAD_REQUEST", { message: error })
            }
        }),
    },
    plugins: [
        jwt({
            jwt: {
                definePayload: ({ user }) => ({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                }),
            },
        }),
    ],
    ...(googleEnabled
        ? {
            socialProviders: {
                google: {
                    clientId: process.env.GOOGLE_CLIENT_ID as string,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
                },
            },
        }
        : {}),
})