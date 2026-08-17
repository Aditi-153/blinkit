import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Item", itemSchema);
