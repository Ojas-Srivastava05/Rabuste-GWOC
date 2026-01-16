export type ArtMedium = "Oil" | "Acrylic" | "Watercolor" | "Mixed Media" | "Digital" | "Photography";
export type ArtCategory = "Abstract" | "Landscape" | "Portrait" | "Contemporary" | "Impressionist" | "Modern";

export interface ArtworkItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: number;
  rating: number;
  medium: ArtMedium;
  dimensions: string;
  year: number;
  imageUrl: string;
  category: ArtCategory;
}

export interface CarouselCategory {
  id: string;
  name: string;
  artworks: ArtworkItem[];
}
