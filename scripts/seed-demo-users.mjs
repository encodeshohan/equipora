import { betterAuth } from "better-auth"
import { mongodbAdapter } from "@better-auth/mongo-adapter"
import { MongoClient } from "mongodb"

const accounts = [
    {
        name: "Demo Admin",
        email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL,
        password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD,
        role: "admin",
    },
    {
        name: "Demo Owner",
        email: process.env.NEXT_PUBLIC_DEMO_OWNER_EMAIL,
        password: process.env.NEXT_PUBLIC_DEMO_OWNER_PASSWORD,
        role: "owner",
    },
]

for (const account of accounts) {
    if (!account.email || !account.password) {
        console.error("Missing NEXT_PUBLIC_DEMO_* values in .env.local")
        process.exit(1)
    }
}

if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing in .env.local")
    process.exit(1)
}

const client = new MongoClient(process.env.MONGODB_URI)
await client.connect()
const db = client.db("equiporadb")

const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: mongodbAdapter(db, { client }),
    emailAndPassword: { enabled: true },
})

const users = db.collection("user")
const sessions = db.collection("session")

for (const account of accounts) {
    const email = account.email.toLowerCase()
    let user = await users.findOne({ email })

    if (!user) {
        await auth.api.signUpEmail({
            body: { name: account.name, email, password: account.password },
        })
        user = await users.findOne({ email })
        console.log(`created ${email}`)
    } else {
        console.log(`already exists: ${email}`)
    }

    // Roles can't be self-assigned at sign-up, so set it directly.
    await users.updateOne({ email }, { $set: { role: account.role } })
    // signUpEmail opens a session; the demo user does not need it.
    await sessions.deleteMany({ userId: user._id.toString() })
    console.log(`  role -> ${account.role}`)
}

await client.close()