import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mongodb.js'
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware, clerkClient } from '@clerk/express'
import connectCloudinary from './configs/cloudinary.js'
import courseRouter from './routes/courseRoute.js'
import userRouter from './routes/useRoutes.js'
import certificateRouter from './routes/certificateRoutes.js'
import notificationRouter from './routes/notificationRoutes.js'
import blockchainRouter from './routes/blockchainRoute.js'
import nftRouter from './routes/nftRoute.js'
import addressRouter from './routes/addressRoute.js'
import premiumRoute from './routes/premiumRoute.js'
import batchMintRouter from './routes/batchMintRoutes.js'
import purchaseRouter from './routes/purchaseRoutes.js'
import violationRouter from './routes/violationRoutes.js'
import violationNFTRouter from './routes/violationNFTRoutes.js'
import qnaRouter from './routes/qnaRoutes.js'
import violationCounterRouter from './routes/violationCounterRoutes.js'
import profileRouter from './routes/profileRoutes.js'
import adminRouter from './routes/adminRoutes.js'
import User from './models/User.js'

const app = express()

//connect DB
await connectDB()
await connectCloudinary()

// Ensure there is at least one admin user
async function ensureDefaultAdmin() {
    try {
        const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD, DEFAULT_ADMIN_NAME } = process.env;
        if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
            console.warn('Default admin bootstrap skipped: DEFAULT_ADMIN_EMAIL or DEFAULT_ADMIN_PASSWORD missing.');
            return;
        }

        // Check if any admin exists (scan first 200 users)
        let offset = 0;
        const limit = 100;
        let hasAdmin = false;
        for (let i = 0; i < 2; i++) {
            const page = await clerkClient.users.getUserList({ limit, offset });
            const users = Array.isArray(page) ? page : page?.data;
            if (!users || users.length === 0) break;
            if (users.some(u => u?.publicMetadata?.role === 'admin')) {
                hasAdmin = true;
                break;
            }
            offset += limit;
        }
        if (hasAdmin) {
            return; // Already has an admin
        }

        // Ensure default admin user exists
        let adminUser;
        let existing;
        try {
            existing = await clerkClient.users.getUserList({ emailAddress: [DEFAULT_ADMIN_EMAIL] });
            adminUser = (existing?.data && existing.data[0]) || (Array.isArray(existing) ? existing[0] : undefined);
        } catch (lookupErr) {
            console.warn('Clerk email lookup failed, falling back to query:', lookupErr?.status || lookupErr?.message);
        }
        if (!adminUser) {
            // Fallback: try query search in case emailAddress filter is not supported
            const searched = await clerkClient.users.getUserList({ query: DEFAULT_ADMIN_EMAIL, limit: 1 });
            const searchedUsers = Array.isArray(searched) ? searched : searched?.data;
            adminUser = searchedUsers?.[0];
        }
        if (!adminUser) {
            const firstName = (DEFAULT_ADMIN_NAME || 'Admin').split(' ')[0];
            const lastName = (DEFAULT_ADMIN_NAME || '').split(' ').slice(1).join(' ');
            try {
                adminUser = await clerkClient.users.createUser({
                    emailAddress: [DEFAULT_ADMIN_EMAIL],
                    password: DEFAULT_ADMIN_PASSWORD,
                    firstName,
                    lastName,
                });
            } catch (createErr) {
                // If identifier (email) already exists, fetch and proceed
                if (createErr?.status === 422) {
                    const fallback = await clerkClient.users.getUserList({ query: DEFAULT_ADMIN_EMAIL, limit: 1 });
                    const fallbackUsers = Array.isArray(fallback) ? fallback : fallback?.data;
                    adminUser = fallbackUsers?.[0];
                    if (!adminUser) throw createErr;
                } else {
                    throw createErr;
                }
            }
        }

        // Set role to admin if not set
        if (adminUser.publicMetadata?.role !== 'admin') {
            await clerkClient.users.updateUserMetadata(adminUser.id, {
                publicMetadata: { role: 'admin' },
            });
        }

        // Ensure a corresponding User document exists
        const dbUser = await User.findById(adminUser.id);
        if (!dbUser) {
            await User.create({
                _id: adminUser.id,
                name: [adminUser.firstName, adminUser.lastName].filter(Boolean).join(' ') || 'Admin',
                email: adminUser.emailAddresses?.[0]?.emailAddress || DEFAULT_ADMIN_EMAIL,
                imageUrl: adminUser.imageUrl || 'https://avatars.githubusercontent.com/u/9919?s=200&v=4',
            });
        }

        console.log('Default admin ensured:', DEFAULT_ADMIN_EMAIL);
    } catch (e) {
        console.error('Failed to ensure default admin:', {
            message: e?.message,
            status: e?.status,
            errors: e?.errors || e?.response?.data || undefined
        });
    }
}

app.use(cors())

app.use(express.json({ limit: '50mb' }))

app.use(clerkMiddleware())

app.get('/', (req, res) => res.send("API Working"))

app.post('/clerk', express.json(), clerkWebhooks)

app.use('/api/educator', express.json(), educatorRouter)

app.use('/api/course', express.json(), courseRouter)

app.use('/api/user', express.json(), userRouter)

app.use('/api/certificate', express.json(), certificateRouter)

app.use('/api/notification', express.json(), notificationRouter)

app.use('/api/blockchain', express.json(), blockchainRouter)

app.use('/api/nft', express.json(), nftRouter)

app.use('/api/profile', express.json(), profileRouter)
app.use('/api/admin', express.json(), adminRouter)

app.use('/api/address', express.json(), addressRouter)

app.use('/api/premium', express.json(), premiumRoute)

app.use('/api/batch', express.json(), batchMintRouter)

app.use('/api/violation', express.json(), violationRouter)

app.use('/api/violation-nft', express.json(), violationNFTRouter)

app.use('/api/violation-counter', express.json(), violationCounterRouter)

app.use('/api/purchase', express.json(), purchaseRouter)

app.use('/api/qna', express.json(), qnaRouter)


app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks)

app.use((err, req, res, next) => {
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error', 
        error: err.message 
    });
});

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

// Fire-and-forget bootstrap after server starts
ensureDefaultAdmin();
