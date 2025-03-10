import { TryCatch } from "../middlewares/error.js";
import { Cart } from "../models/cart.js";
import { Product } from "../models/product.js";
import jwt from "jsonwebtoken";

const getUserIdFromCookie = (req) => {
  const token = req.cookies["rupkalaid"];
  if (!token) return null;

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    return decodedData._id;
  } catch (error) {
    return null;
  }
};

const addToCart = TryCatch(async (req, res, next) => {
  const userId = getUserIdFromCookie(req);
  if (!userId) return res.status(401).json({ success: false, message: "Please login first" });

  const { productId } = req.body;
  if (!productId) return res.status(400).json({ success: false, message: "Product ID is required" });

  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, products: [{ productId, quantity: 1 }] });
  } else {
    const existingProduct = cart.products.find((p) => p.productId.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }
  }

  await cart.save();
  res.status(200).json({ success: true, message: "Product added to cart", cart });
});

const getCart = TryCatch(async (req, res, next) => {
  const userId = getUserIdFromCookie(req);
  if (!userId) return res.status(401).json({ success: false, message: "Please login first" });

  const cart = await Cart.findOne({ userId }).populate("products.productId");
  if (!cart) return res.status(200).json({ success: true, cart: [] });

  res.status(200).json({ success: true, cart: cart.products });
});

const updateCart = TryCatch(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const userId = getUserIdFromCookie(req);

  if (!productId || quantity < 1) {
    return res.status(400).json({ success: false, message: "Invalid product ID or quantity" });
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

  const itemIndex = cart.products.findIndex((item) => item.productId.toString() === productId);
  if (itemIndex === -1) return res.status(404).json({ success: false, message: "Product not found in cart" });

  cart.products[itemIndex].quantity = quantity;
  await cart.save();

  res.status(200).json({ success: true, message: "Cart updated successfully" });
});

const removeFromCart = TryCatch(async (req, res, next) => {
  const { productId } = req.body;
  const userId = getUserIdFromCookie(req);

  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

  cart.products = cart.products.filter((item) => item.productId.toString() !== productId);
  await cart.save();

  res.status(200).json({ success: true, message: "Product removed from cart" });
});

export { addToCart, getCart, updateCart, removeFromCart };
