import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../lib/helper.js";

const getDomainFromUrl = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return `.${hostname}`; // Ensures it works for subdomains
  } catch (error) {
    console.error("Invalid CLIENT_URL:", error);
    return ".rupkala-iota.vercel.app"; // Default fallback domain
  }
};
const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  sameSite: "None", // Required for cross-origin requests
  httpOnly: true, // Prevents client-side access
  secure: true,
  domain: getDomainFromUrl(process.env.CLIENT_URL),// Ensures cookies are only sent over HTTPS
};

const connectDB = async (uri) => {
  try {
    const data = await mongoose.connect(uri, { dbName: "fashion" });
    console.log(`Connected to DB: ${data.connection.host}`);
  } catch (err) {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  }
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res
    .status(code)
    .cookie("rupkalaid", token, cookieOptions)
    .json({
      success: true,
      user,
      message,
    });
};


const uploadFilesToCloudinary = async (file) => {
  if (!file || !file.buffer || !file.mimetype) {
    throw new Error("Invalid file provided");
  }

  return new Promise((resolve, reject) => {
    const base64String = getBase64(file);

    cloudinary.uploader.upload(
      base64String,
      { resource_type: "auto", public_id: uuid() },
      (error, result) => {
        if (error) return reject(error);
        resolve({ public_id: result.public_id, url: result.secure_url });
      }
    );
  });
};


const deletFilesFromCloudinary = async (public_ids) => {
  // Delete files from cloudinary
};
// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:4173",
//     process.env.CLIENT_URL,
//   ],
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   credentials: true,
// };

const allowedOrigins = [
  process.env.CLIENT_URL.replace(/\/$/, ""), // Remove trailing slash
  "https://rupkala-iota.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allows cookies and authentication headers
};
export {
  connectDB,
  sendToken,
  cookieOptions,
  deletFilesFromCloudinary,
  uploadFilesToCloudinary,
  corsOptions,
};
