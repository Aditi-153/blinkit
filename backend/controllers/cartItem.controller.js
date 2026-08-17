import Item from "../models/items.model.js";
import CartItem from "../models/cartItem.model.js";
import Cart from "../models/cart.model.js";

export const addItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found!",
      });
    }

    if (item.stock <= 0) {
      return res.status(400).json({
        message: "Item is out of stock",
      });
    }

    const existingItem = await CartItem.findOne({
      user: req.user._id,
      item: id,
    });

    if (existingItem) {
      if (existingItem.quantity >= item.stock) {
        return res.status(400).json({
          message: "Not enough stock available",
        });
      }

      existingItem.quantity += 1;
      existingItem.price = existingItem.quantity * item.price;

      await existingItem.save();

      const cart = await Cart.findOne({
        user: req.user._id,
      });

      cart.totalPrice += item.price;

      await cart.save();

      return res.status(200).json({
        message: "Item quantity updated successfully",
        cartItem: existingItem,
        cart,
      });
    }

    const newCartItem = await CartItem.create({
      user: req.user._id,
      item: id,
      quantity: 1,
      price: item.price,
    });

    let cart = await Cart.findOne({
      user: req.user._id,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [newCartItem._id],
        totalPrice: newCartItem.price,
      });
    } else {
      cart.items.push(newCartItem._id);
      cart.totalPrice += newCartItem.price;

      await cart.save();
    }

    return res.status(201).json({
      message: "Item added successfully",
      cartItem: newCartItem,
      cart,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to add item",
    });
  }
};

export const getCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate({
      path: "items",
      populate: {
        path: "item",
      },
    });

    if (!cart) {
      return res.status(400).json({
        message: "cart not found",
      });
    }

    return res.status(200).json({
      message: "cart found successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json({
      message: "failed to fetch cart",
    });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        message: "Quantity must be at least 1",
      });
    }

    const cartItem = await CartItem.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const item = await Item.findById(cartItem.item);

    if (quantity > item.stock) {
      return res.status(400).json({
        message: "Not enough stock available",
      });
    }

    const oldPrice = cartItem.price;

    cartItem.quantity = quantity;
    cartItem.price = item.price * quantity;

    await cartItem.save();

    const cart = await Cart.findOne({ user: req.user._id });

    cart.totalPrice = cart.totalPrice - oldPrice + cartItem.price;

    await cart.save();

    return res.status(200).json({
      message: "Quantity updated successfully",
      cartItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update quantity",
    });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await CartItem.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.totalPrice -= cartItem.price;

    cart.items = cart.items.filter((itemId) => itemId.toString() !== id);

    await cart.save();

    await CartItem.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Item removed from cart successfully",
      cart,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to delete item",
    });
  }
};
