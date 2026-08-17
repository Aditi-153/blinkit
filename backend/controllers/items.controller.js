import Item from "../models/items.model.js";

// admin
export const createItem = async (req, res) => {
  try {
    const { itemName, description, price, stock } = req.body;

    if (
      !itemName ||
      !description ||
      price === undefined ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const newItem = await Item.create({
      itemName,
      description,
      price,
      stock,
    });

    return res.status(201).json({
      message: "Item created successfully",
      item: newItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to add new item",
    });
  }
};

// admin
export const editItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedItem = await Item.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    return res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to update item",
    });
  }
};

// admin
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Item.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    return res.status(200).json({
      message: "Item deleted successfully",
      item: deletedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to delete item",
    });
  }
};


export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();

    return res.status(200).json({
      message: "Items fetched successfully",
      items,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch items",
    });
  }
};


export const getSingleItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    return res.status(200).json({
      message: "Item fetched successfully",
      item,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to fetch item",
    });
  }
};