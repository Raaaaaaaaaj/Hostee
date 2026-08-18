import express, {Request, Response} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load Dotenv configuration
dotenv.config();

// Creating Express and configuring PORT
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); //Allow clients to make request here
app.use(express.json()); //Allow express to parse JSON

// Basic Health Check Route
app.get('/api/health', (req: Request, res: Response) =>{
    res.json({
        status: 'success',
        message: 'Hostee server is running successfully',
        timestamp: new Date().toISOString()
    })
})

// Start the Server
app.listen(PORT, ()=>{
    console.log(`Server is running on PORT: ${PORT}`);
})
