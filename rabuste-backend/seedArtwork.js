import mongoose from "mongoose";
import Art from "./src/models/art.js";
import dotenv from "dotenv";

dotenv.config();

const artworkData = [
  {
    title: "Urban Dreams",
    artist: "Alex Rivera",
    description: "A vibrant exploration of city life through bold colors and abstract forms. This piece captures the energy and chaos of modern urban existence.",
    price: 45000,
    images: [
      "https://picsum.photos/seed/art1a/800/1200",
      "https://picsum.photos/seed/art1b/800/1200",
    ],
    category: "painting",
    medium: "Acrylic on Canvas",
    dimensions: "36 x 48 inches",
    year: 2024,
    stock: 1,
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "Serenity in Stone",
    artist: "Marina Chen",
    description: "A minimalist sculpture that embodies peace and balance. Hand-carved from Italian marble with incredible attention to detail.",
    price: 125000,
    images: [
      "https://picsum.photos/seed/art2a/800/1000",
      "https://picsum.photos/seed/art2b/800/1000",
      "https://picsum.photos/seed/art2c/800/1000",
    ],
    category: "sculpture",
    medium: "Italian Marble",
    dimensions: "24 x 18 x 12 inches",
    year: 2023,
    stock: 1,
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "Golden Hour",
    artist: "James Patterson",
    description: "Captured during the perfect moment when light transforms the ordinary into extraordinary. A stunning landscape photograph.",
    price: 18000,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop",
    ],
    category: "photography",
    medium: "Digital Print on Fine Art Paper",
    dimensions: "20 x 30 inches",
    year: 2024,
    stock: 3,
    isAvailable: true,
  },
  {
    title: "Digital Horizon",
    artist: "Sophie Nakamura",
    description: "A mesmerizing blend of technology and nature. This digital artwork pushes the boundaries of visual art in the modern age.",
    price: 32000,
    images: [
      "https://picsum.photos/seed/art4a/1000/1000",
      "https://picsum.photos/seed/art4b/1000/1000",
    ],
    category: "digital",
    medium: "Digital Art (NFT Available)",
    dimensions: "4K Digital File",
    year: 2024,
    stock: 5,
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "Coffee & Contemplation",
    artist: "Lucas Martinez",
    description: "A series of intimate moments in coffee culture. Each piece tells a story of connection, solitude, and the ritual of brewing.",
    price: 28000,
    images: [
      "https://images.pexels.com/photos/3914189/pexels-photo-3914189.jpeg?w=800&h=1200&fit=crop",
    ],
    category: "photography",
    medium: "Silver Gelatin Print",
    dimensions: "16 x 24 inches",
    year: 2023,
    stock: 2,
    isAvailable: true,
  },
  {
    title: "Abstract Emotions",
    artist: "Emma Williams",
    description: "An exploration of human feelings through color and texture. Each brushstroke represents a different emotional state.",
    price: 52000,
    images: [
      "https://picsum.photos/seed/art6a/900/1200",
      "https://picsum.photos/seed/art6b/900/1200",
      "https://picsum.photos/seed/art6c/900/1200",
    ],
    category: "painting",
    medium: "Mixed Media on Canvas",
    dimensions: "40 x 60 inches",
    year: 2024,
    stock: 1,
    isAvailable: true,
  },
  {
    title: "Industrial Symphony",
    artist: "Michael Zhang",
    description: "Combining metal, wood, and found objects to create a three-dimensional narrative about modern industry and craftsmanship.",
    price: 95000,
    images: [
      "https://picsum.photos/seed/art7a/800/1000",
    ],
    category: "mixed-media",
    medium: "Steel, Wood, and Found Objects",
    dimensions: "48 x 36 x 24 inches",
    year: 2023,
    stock: 1,
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "Botanical Dreams",
    artist: "Isabella Rodriguez",
    description: "A stunning series capturing the intricate beauty of rare botanical specimens. Each print is a testament to nature's artistry.",
    price: 22000,
    images: [
      "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1496186402681-c04f65e5bd57?w=800&h=1200&fit=crop",
    ],
    category: "photography",
    medium: "Archival Pigment Print",
    dimensions: "18 x 24 inches",
    year: 2024,
    stock: 4,
    isAvailable: true,
  },
  {
    title: "Neon Noir",
    artist: "David Kim",
    description: "A cyberpunk-inspired digital masterpiece blending futuristic aesthetics with noir atmosphere. Limited edition digital print.",
    price: 38000,
    images: [
      "https://picsum.photos/seed/art9a/1200/1600",
      "https://picsum.photos/seed/art9b/1200/1600",
    ],
    category: "digital",
    medium: "Digital Print on Metal",
    dimensions: "30 x 40 inches",
    year: 2024,
    stock: 2,
    isAvailable: true,
  },
  {
    title: "Espresso Essence",
    artist: "Olivia Santos",
    description: "A textured exploration of coffee's rich heritage. Mixed media incorporating actual coffee grounds and gold leaf.",
    price: 48000,
    images: [
      "https://images.pexels.com/photos/6278746/pexels-photo-6278746.jpeg?w=800&h=1200&fit=crop",
    ],
    category: "mixed-media",
    medium: "Coffee, Gold Leaf, Acrylic",
    dimensions: "24 x 36 inches",
    year: 2024,
    stock: 1,
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "Midnight Reflections",
    artist: "Thomas Anderson",
    description: "A moody landscape series capturing the quiet beauty of night. Each photograph is a meditation on solitude and contemplation.",
    price: 25000,
    images: [
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=1200&fit=crop",
    ],
    category: "photography",
    medium: "Metallic Print",
    dimensions: "24 x 36 inches",
    year: 2023,
    stock: 3,
    isAvailable: true,
  },
  {
    title: "Geometric Harmony",
    artist: "Nina Patel",
    description: "Precision-cut shapes in vibrant hues create a mesmerizing pattern. This piece explores the intersection of mathematics and beauty.",
    price: 42000,
    images: [
      "https://picsum.photos/seed/art12a/1000/1000",
      "https://picsum.photos/seed/art12b/1000/1000",
    ],
    category: "painting",
    medium: "Oil on Wood Panel",
    dimensions: "30 x 30 inches",
    year: 2024,
    stock: 1,
    isAvailable: true,
  },
  {
    title: "Fluid Motion",
    artist: "Carlos Mendes",
    description: "Bronze sculpture capturing the elegance of movement. This piece seems to defy gravity with its flowing organic forms.",
    price: 155000,
    images: [
      "https://picsum.photos/seed/art13a/600/1200",
    ],
    category: "sculpture",
    medium: "Bronze",
    dimensions: "60 x 20 x 18 inches",
    year: 2023,
    stock: 1,
    isAvailable: true,
    isFeatured: true,
  },
  {
    title: "Café Culture",
    artist: "Rachel Green",
    description: "A vibrant collection celebrating the social spaces where coffee and community intersect. Bold colors and dynamic compositions.",
    price: 35000,
    images: [
      "https://images.pexels.com/photos/1449773/pexels-photo-1449773.jpeg?w=800&h=1200&fit=crop",
      "https://images.pexels.com/photos/5473269/pexels-photo-5473269.jpeg?w=800&h=1200&fit=crop",
    ],
    category: "painting",
    medium: "Acrylic and Collage",
    dimensions: "32 x 48 inches",
    year: 2024,
    stock: 1,
    isAvailable: true,
  },
  {
    title: "Data Streams",
    artist: "Kevin Liu",
    description: "An algorithmic artwork generated through machine learning. Each piece is unique, representing the beauty of artificial intelligence.",
    price: 58000,
    images: [
      "https://picsum.photos/seed/art15a/1200/1200",
      "https://picsum.photos/seed/art15b/1200/1200",
      "https://picsum.photos/seed/art15c/1200/1200",
    ],
    category: "digital",
    medium: "Generative Art Print",
    dimensions: "36 x 36 inches",
    year: 2024,
    stock: 10,
    isAvailable: true,
  },
];

const seedArtwork = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing artworks
    await Art.deleteMany({});
    console.log("Cleared existing artworks");

    // Insert new artworks
    const result = await Art.insertMany(artworkData);
    console.log(`✅ Successfully added ${result.length} artworks to the gallery!`);

    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding artwork:", err);
    process.exit(1);
  }
};

seedArtwork();