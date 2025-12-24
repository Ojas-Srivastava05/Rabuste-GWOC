import Artwork from "../models/Artwork.js";

export const addArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.create(req.body);
    res.status(201).json(artwork);
  } catch {
    res.status(500).json({ message: "Failed to add artwork" });
  }
};

export const getAllArtworks = async (req, res) => {
  try {
    const artworks = await Artwork.find();
    res.json(artworks);
  } catch {
    res.status(500).json({ message: "Failed to fetch artworks" });
  }
};

export const getArtworkById = async (req, res) => {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Not found" });
    res.json(art);
  } catch {
    res.status(500).json({ message: "Error fetching artwork" });
  }
};

export const updateArtwork = async (req, res) => {
  try {
    const updated = await Artwork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update artwork" });
  }
};

export const deleteArtwork = async (req, res) => {
  try {
    await Artwork.findByIdAndDelete(req.params.id);
    res.json({ message: "Artwork deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete artwork" });
  }
};
