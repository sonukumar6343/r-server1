import mongoose, { Schema, model } from "mongoose";

const billSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {
        type: Number,
        required: true,
      },
      phoneNo: {
        type: Number,
        required: true,
      },
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    paymentInfo: {
      transactionId: {
        type: String,
        default: null,
      },
      status: {
        type: String,
        default: "Not Completed",
      },
    },
  },
  { timestamps: true }
);

export const Bill = mongoose.models.Bill || model("Bill", billSchema);
