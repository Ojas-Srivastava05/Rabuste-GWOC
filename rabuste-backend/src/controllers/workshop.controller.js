import Workshop from "../models/Workshop.js";

export const addWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json(workshop);
  } catch {
    res.status(500).json({ message: "Failed to add workshop" });
  }
};

export const getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find();
    res.json(workshops);
  } catch {
    res.status(500).json({ message: "Failed to fetch workshops" });
  }
};

export const getWorkshopById = async (req, res) => {
  try {
    const ws = await Workshop.findById(req.params.id);
    if (!ws) return res.status(404).json({ message: "Not found" });
    res.json(ws);
  } catch {
    res.status(500).json({ message: "Error fetching workshop" });
  }
};

export const updateWorkshop = async (req, res) => {
  try {
    const updated = await Workshop.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update workshop" });
  }
};

export const deleteWorkshop = async (req, res) => {
  try {
    await Workshop.findByIdAndDelete(req.params.id);
    res.json({ message: "Workshop deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete workshop" });
  }
};
