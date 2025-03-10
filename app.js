import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB, corsOptions } from "./utils/features.js";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import bodyParser from "body-parser";
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import paymentRoute from "./routes/payment.js";
import adminRoute from "./routes/admin.js";
import cartRoute from "./routes/cart.js";
import orderRoute from "./routes/order.js";

dotenv.config({ path: "./.env" });
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const app = express();
app.set("trust proxy",1);
const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const port = process.env.PORT || 4000;
const adminSecretKey = process.env.ADMIN_SECRET_KEY || "helloworld";
connectDB(mongoURI);

app.use(express.json());

app.use(cors(corsOptions));//pehle isko rkhna hai
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/user", userRoute);
app.use("/api/product", productRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/admin", adminRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export { adminSecretKey };
