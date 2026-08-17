import Address from "../models/address.model.js";

export const newAddress = async (req, res) => {
  try {
    const { fullName, phone, city, pincode, googleMapLink } = req.body;

    if (!fullName || !phone || !city || !pincode) {
      return res.status(400).json({
        message: "All required fields are required",
      });
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      city,
      pincode,
      googleMapLink,
    });

    return res.status(201).json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to add address",
    });
  }
};
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    });

    if (addresses.length === 0) {
      return res.status(404).json({
        message: "No addresses found",
      });
    }

    return res.status(200).json({
      message: "Addresses fetched successfully",
      addresses,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to fetch addresses",
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    return res.status(200).json({
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to update address",
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    return res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Failed to delete address",
    });
  }
};
