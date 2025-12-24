import Menu from "../models/Menu.js";

//  Add menu item
export const addMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      brewTime,
      category,
    } = req.body;

    if (!name || !price || !image || !brewTime || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const item = await Menu.create({
      name,
      description,
      price,
      image,
      brewTime,
      category,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to add menu item" });
  }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menu = await Menu.find();
    res.status(200).json(menu);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch menu" });
  }
};
