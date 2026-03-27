import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.configDotenv()
export const connectDB = async () => {

    await mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB");
    } )
    .catch((error)=>{
        console.error(error.message)
    })
    

}