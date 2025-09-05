import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/Auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config()

const app = express();

const PORT = process.env.PORT || 3000; 

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
}));

app.use('/api/auth', AuthRoute);


mongoose.connect(process.env.MONGODB_CONN).then(() => {
    console.log("Database Connection Successful");
}).catch(err => console.log("Database Connection lost", err))

app.listen(PORT, function() {
    console.log("Server is running on PORT: ", PORT);
})
