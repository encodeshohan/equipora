import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

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

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
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
    },
})