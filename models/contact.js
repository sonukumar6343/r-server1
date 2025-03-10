import mongoose, { Schema, model } from "mongoose";

const schema = new Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  feedback: { type: String, required: true },
  attended: { type: Boolean, default: false },
});

export const Contact = mongoose.models.Contact|| model("Contact", schema);

