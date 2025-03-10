import express from "express";
import { login,register,getMyProfile,registercontact } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();
app.post("/login", login);
app.post("/register", register);
app.post("/contact", registercontact);
app.use(isAuthenticated);
app.get("/me", getMyProfile);
export default app;