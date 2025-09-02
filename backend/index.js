import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()

const app = express();
const PORT= process.env.PORT || 5000 ;

mongoose.connect(process.env.MONGODB_CONN).then(() => {
    console.log("Database Connection Successful");
}).catch(err=>console.log("Database Connection lost", err))

app.listen(PORT, function() {
    console.log("Server is running on PORT: ", PORT);
})

