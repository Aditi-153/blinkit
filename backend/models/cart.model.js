import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CartItem",
      },
    ],

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Cart", cartSchema);
