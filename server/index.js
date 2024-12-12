import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js'

import { connectDB } from './db/connectDB.js';

const PORT = process.env.PORT || 5000; // port coming from .env
dotenv.config() // connects the .env file
const app = express(); // initializes express

app.get('/', (req, res) => {
    res.send('Server is working!');
});


app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json()); // allows us to parse incoming requests: req.body
app.use(cookieParser());

app.use("/api/auth", authRoutes)


app.listen(PORT, ()=> {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})