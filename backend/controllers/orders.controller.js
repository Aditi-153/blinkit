import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import CartItem from "../models/cartItem.model.js";
import Item from "../models/items.model.js";
import Address from "../models/address.model.js";

export const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;

    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items",
      populate: {
        path: "item",
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of cart.items) {
      const item = await Item.findById(cartItem.item._id);

      if (!item) {
        return res.status(404).json({
          message: `${cartItem.item.itemName} not found`,
        });
      }

      if (item.stock < cartItem.quantity) {
        return res.status(400).json({
          message: `${item.itemName} is out of stock`,
        });
      }

      totalAmount += item.price * cartItem.quantity;

      orderItems.push({
        item: item._id,
        quantity: cartItem.quantity,
        price: item.price,
      });

      item.stock -= cartItem.quantity;
      await item.save();
    }

    const order = await Order.create({
      user: req.user._id,
      address: address._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
    });

    await CartItem.deleteMany({
      _id: { $in: cart.items },
    });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to place order",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("address")
      .populate("items.item");

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate("address")
      .populate("items.item");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch order",
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({
        message: "Delivered order cannot be cancelled",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Order is already cancelled",
      });
    }

    for (const orderItem of order.items) {
      const item = await Item.findById(orderItem.item);

      if (item) {
        item.stock += orderItem.quantity;
        await item.save();
      }
    }

    order.status = "Cancelled";

    await order.save();

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to cancel order",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("address")
      .populate("items.item");

    return res.status(200).json({
      message: "All orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};
