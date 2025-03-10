import express from "express";
import {
  processPayment,
  sendRazorpayApiKey,
  paymentVerification,
} from "../controllers/paymentController.js";

const router = express.Router();

router.route("/process").post( processPayment);
router.route("/getkey").get( sendRazorpayApiKey);
router.route("/paymentVerification/:id").post(paymentVerification);

export default router;
