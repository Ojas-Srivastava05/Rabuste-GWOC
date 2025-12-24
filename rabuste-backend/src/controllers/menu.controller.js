import Menu from "../models/Menu.js";

/* CREATE */
export const addMenuItem = async (req, res) => {
  try {
    const item = await Menu.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to add menu item" });
  }
};

/* READ – all */
export const getAllMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch {
    res.status(500).json({ message: "Failed to fetch menu" });
  }
};

/* READ – single */
export const getMenuItemById = async (req, res) => {
  try {
    const item = await Menu.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch {
    res.status(500).json({ message: "Error fetching item" });
  }
};

/* UPDATE */
export const updateMenuItem = async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update menu item" });
  }
};

/* DELETE  */
export const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndUpdate(req.params.id, { inStock: false });
    res.json({ message: "Menu item disabled" });
  } catch {
    res.status(500).json({ message: "Failed to delete menu item" });
  }
};
