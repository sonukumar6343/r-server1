import express from "express";
import {
  getAllProducts,
  getProductDetails,
  categorywiseproduct,
} from "../controllers/product.js";

const router = express.Router();

// Get all products
router.get("/products", getAllProducts);

// Get product details by ID (should be GET)
router.get("/productdetails/:id", getProductDetails);

// Get products by category (should be GET with query params)
router.get("/productsbycategory", categorywiseproduct);

export default router;
