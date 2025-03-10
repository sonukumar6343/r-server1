import { adminSecretKey } from "../app.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions, uploadFilesToCloudinary } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { Product } from "../models/product.js";
import jwt from "jsonwebtoken";
const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("rupkala-admin", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Authenticated Successfully, Welcome BOSS",
    });
});
const createProduct = TryCatch(async (req, res, next) => {
  const { name, description, price, originalPrice, category } = req.body;
  const file = req.file;
  if (!name || !description || !price || !originalPrice || !file) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  const imageUrl = await uploadFilesToCloudinary(file); // Upload a single image

  if (!imageUrl) {
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
    });
  }
  if (category == "") {
    category= "All Collections";
  }
  const product = await Product.create({
    name,
    description,
    price,
    originalPrice,
    category,
    images: [
      {
        public_id: imageUrl.public_id,
        url: imageUrl.url,
      },
    ],
  });

  res.status(201).json({
    success: true,
    message: "Product Created Successfully",
    product,
  });
});

const updateProduct = TryCatch(async (req, res, next) => {
  const { price } = req.body;
  const file = req.file; // Expecting a single file
  const { id } = req.params;

  let product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  if (file) {
    const imageUrl = await uploadFilesToCloudinary(file); // Upload file to Cloudinary

    if (imageUrl) {
      product.images = [{ public_id: imageUrl.public_id, url: imageUrl.url }]; // Replace with new image
    }
  }

  if (price) {
    product.price = price;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    product,
  });
});

const deleteProduct = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});
const getallProducts = TryCatch(async (req, res, next) => {
  const products = await Product.find({}, "name description price images");
  const formattedProducts = products.map((product) => ({
    _id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    image: product.images.length > 0 ? product.images[0].url : null,
  }));

  res.status(200).json({
    success: true,
    products: formattedProducts,
  });
});
export {
  adminLogin,
  createProduct,
  updateProduct,
  deleteProduct,
  getallProducts,
};
