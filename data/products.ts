export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  rating?: number;
  reviewsCount?: number;
  variants?: {
    colors?: string[];
    sizes?: string[];
  };
};

export const products: Product[] = [
  // Sarees
  {
    id: "s1",
    name: "Banarasi Silk Saree",
    price: 5499,
    image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
    category: "Saree",
    description: "Handwoven Banarasi silk saree with intricate zari work and a luxurious drape.",
    rating: 4.5,
    reviewsCount: 24,
    variants: { colors: ["Red", "Green", "Gold"], sizes: ["Free Size"] },
  },
  {
    id: "s2",
    name: "Kanjivaram Silk",
    price: 6999,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    category: "Saree",
    description: "Traditional Kanjivaram silk with rich borders and classic motifs.",
    rating: 4.7,
    reviewsCount: 31,
    variants: { colors: ["Pink", "Blue"], sizes: ["Free Size"] },
  },

  // Suits
  {
    id: "st1",
    name: "Designer Suit Set",
    price: 4299,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1136&q=80",
    category: "Suit",
    description: "Elegant three-piece designer suit set perfect for festive occasions.",
    rating: 4.3,
    reviewsCount: 18,
    variants: { colors: ["Beige", "Maroon"], sizes: ["S", "M", "L", "XL"] },
  },
  {
    id: "st2",
    name: "Party Wear Suit",
    price: 3599,
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    category: "Suit",
    description: "Stylish party wear suit with modern cuts and premium fabric.",
    rating: 4.1,
    reviewsCount: 12,
    variants: { colors: ["Black", "Navy"], sizes: ["S", "M", "L", "XL"] },
  },

  // Jeans
  {
    id: "j1",
    name: "Slim Fit Jeans",
    price: 1799,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
    category: "Jeans",
    description: "Comfortable slim fit jeans with stretch for all-day wear.",
    rating: 4.2,
    reviewsCount: 40,
    variants: { colors: ["Blue", "Black"], sizes: ["28", "30", "32", "34", "36"] },
  },
  {
    id: "j2",
    name: "Ripped Jeans",
    price: 2199,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1026&q=80",
    category: "Jeans",
    description: "Trendy ripped jeans for a casual street-style look.",
    rating: 4.0,
    reviewsCount: 22,
    variants: { colors: ["Blue"], sizes: ["30", "32", "34"] },
  },

  // Pants
  {
    id: "p1",
    name: "Formal Trousers",
    price: 1599,
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    category: "Pants",
    description: "Classic formal trousers with a tailored fit for office wear.",
    rating: 4.1,
    reviewsCount: 15,
    variants: { colors: ["Gray", "Navy"], sizes: ["S", "M", "L", "XL"] },
  },
  {
    id: "p2",
    name: "Casual Chinos",
    price: 1399,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1136&q=80",
    category: "Pants",
    description: "Versatile casual chinos with a comfortable mid-rise.",
    rating: 4.0,
    reviewsCount: 10,
    variants: { colors: ["Khaki", "Blue"], sizes: ["S", "M", "L", "XL"] },
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}
