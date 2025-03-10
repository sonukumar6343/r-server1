import { Bill } from "../models/bill.js";
import { TryCatch } from "../middlewares/error.js";
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

const createOrder = TryCatch(async (req, res, next) => {
  let { shippingInfo, orderItems } = req.body;
  const userId = getUserIdFromCookie(req);

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please log in to place an order.",
    });
  }

  if (!shippingInfo || !orderItems || orderItems.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid order data. Please provide all required fields.",
    });
  }

  // Convert pinCode & phoneNo to Numbers
  shippingInfo.pinCode = Number(shippingInfo.pinCode);
  shippingInfo.phoneNo = Number(shippingInfo.phoneNo);

  // Validate address fields (ensure they are not empty)
  const requiredFields = ["address", "city", "state", "country", "pinCode", "phoneNo"];
  for (let field of requiredFields) {
    if (!shippingInfo[field]) {
      return res.status(400).json({
        success: false,
        message: "Incorrect address mentioned. Please provide a valid shipping address.",
      });
    }
  }

  // Validate pinCode & phoneNo (ensure they are valid numbers)
  if (isNaN(shippingInfo.pinCode) || isNaN(shippingInfo.phoneNo)) {
    return res.status(400).json({
      success: false,
      message: "Incorrect address mentioned. PinCode and PhoneNo must be valid numbers.",
    });
  }

  // Create Order
  const order = await Bill.create({
    user: userId,
    shippingInfo,
    orderItems,
    paymentInfo: { transactionId: null, status: "Not Completed" }, 
  });

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});
const getAllCompletedOrders = TryCatch(async (req, res, next) => {
  const completedOrders = await Bill.find({ "paymentInfo.status": "Completed" })
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("orderItems.product", "name price");
  if (completedOrders.length === 0) {
    return res.status(200).json({
      success: true,
      message: "No completed orders found",
      orders: []
    });
  }
  res.status(200).json({
    success: true,
    count: completedOrders.length,
    orders: completedOrders
  });
});
export { createOrder,getAllCompletedOrders};
