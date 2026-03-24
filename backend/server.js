import express from 'express';
import cors from 'cors';
import 'dotenv/config';
const app = express();
const port = 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db

// Routes
app.get('/', (req, res) => {
    res.send('API WORKING');
});

app.listen(port,()=>{
    console.log(`Server running on port http://localhost:${port}`);
})