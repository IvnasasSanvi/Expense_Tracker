import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';
import incomeRouter from './routes/incomeRoute.js';
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db
connectDB();

// Routes
app.use("/api/user", userRouter)
//app.use("/api/income", incomeRouter)

app.get('/', (req, res) => {
    res.send('API WORKING');
});



app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`);
})