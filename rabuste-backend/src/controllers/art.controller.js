import Art from "../models/art.js";

/* CREATE */
export const addArtItem = async (req, res) => {
  try {
    const item = await Art.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    console.error("Error adding art item:", err);
    res.status(500).json({ message: "Failed to add art item" });
  }
};

/* READ – all */
export const getAllArtItems = async (req, res) => {
  try {
    const items = await Art.find();
    res.json(items);
  } catch (err) {
    console.error("Error fetching art items:", err);
    res.status(500).json({ message: "Failed to fetch art gallery" });
  }
};

/* READ – single */
export const getArtItemById = async (req, res) => {
  try {
    const item = await Art.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Art item not found" });
    res.json(item);
  } catch (err) {
    console.error("Error fetching art item:", err);
    res.status(500).json({ message: "Error fetching art item" });
  }
};

/* UPDATE */
export const updateArtItem = async (req, res) => {
  try {
    const updated = await Art.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Error updating art item:", err);
    res.status(500).json({ message: "Failed to update art item" });
  }
};

/* DELETE */
export const deleteArtItem = async (req, res) => {
  try {
    await Art.findByIdAndUpdate(req.params.id, { isAvailable: false });
    res.json({ message: "Art item disabled" });
  } catch (err) {
    console.error("Error deleting art item:", err);
    res.status(500).json({ message: "Failed to delete art item" });
  }
};