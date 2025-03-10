import express from "express";
import { createOrder,getAllCompletedOrders } from "../controllers/order.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/allorders", getAllCompletedOrders);

export default router;
