import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/Auth.route.js";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT 3000 as confirmed by your server output

// Correct middleware order:
app.use(express.json());

// Corrected and more explicit CORS configuration
app.use(cors({
    origin: "http://localhost:5174", // Your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
    credentials: true,
}));

app.use('/api/auth', AuthRoute);


mongoose.connect(process.env.MONGODB_CONN).then(() => {
    console.log("Database Connection Successful");
}).catch(err => console.log("Database Connection lost", err))

app.listen(PORT, function() {
    console.log("Server is running on PORT: ", PORT);
})
