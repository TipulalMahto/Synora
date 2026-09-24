import app from '../server/src/app.js'
import { connectDB } from '../server/src/db.js'

const DEFAULT_MONGO_URI = 'mongodb+srv://Admin:Xyz%40123@cluster0.qvxi2fq.mongodb.net/Synora'

export default async function handler(req, res) {
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || DEFAULT_MONGO_URI
    try {
        await connectDB(uri)
    } catch (err) {
        console.warn('MongoDB connection error in serverless handler:', err.message)
    }
    return app(req, res)
}
