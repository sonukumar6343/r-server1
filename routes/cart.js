import express from "express";
import { addToCart, getCart,updateCart,removeFromCart } from "../controllers/cart.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();
router.use(isAuthenticated);
router.post("/add", addToCart);
router.get("/", getCart);
router.post("/update", updateCart);
router.post("/delete", removeFromCart);
export default router;
