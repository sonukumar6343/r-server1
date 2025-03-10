import express from "express";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
import {
  adminLogin,
  createProduct,
  updateProduct,
  deleteProduct,
  getallProducts
} from "../controllers/admin.js";
import { isAdmin } from "../middlewares/auth.js";

const app = express.Router();
app.post("/login", adminLogin);
app.use(isAdmin);
app.post("/createproduct",upload.single("image1"), createProduct);
app.get("/getallproduct", getallProducts);
app.put("/updateproduct/:id", upload.single("image"), updateProduct);
app.delete("/deleteproduct/:id", deleteProduct);


export default app;
