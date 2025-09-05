import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/Auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000; 
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

app.use('/api/auth', AuthRoute);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

mongoose.connect(process.env.MONGODB_CONN)
    .then(() => {
        console.log("Database Connection Successful");
    })
    .catch(err => console.log("Database Connection lost", err));

app.listen(PORT, function() {
    console.log("Server is running on PORT: ", PORT);
});
