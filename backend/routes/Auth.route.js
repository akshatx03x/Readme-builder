import express from "express";
import { login, manualLogin, getUser, getRepos, logout } from "../controllers/Auth.controller.js";

const AuthRoute = express.Router();

AuthRoute.post("/google-login", login);
AuthRoute.post("/github-login", login);
AuthRoute.post("/manual-login", manualLogin);
AuthRoute.post("/logout", logout);
AuthRoute.get("/get-user", getUser); // Fix the endpoint name to match
AuthRoute.get("/repos", getRepos); // Add this line

export default AuthRoute;
