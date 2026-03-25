import mongoose from "mongoose";

export const connectDB = async () => {

    await mongoose.connect("mongodb+srv://sanvijsr1_db_user:eWDzXqLizCloSAcS@cluster0.u9avbrs.mongodb.net/Expense")
    .then(() => {
        console.log("Connected to MongoDB");
    } )

}