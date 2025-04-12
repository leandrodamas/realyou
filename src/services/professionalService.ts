
import { Professional } from "@/types/Professional";

// Mock professionals data with coordinates for 3D map
export const getProfessionals = (): Professional[] => [
  {
    id: 1,
    name: "Dr. Carlos Silva",
    title: "Desenvolvedor Senior",
    rating: 4.9,
    reviews: 132,
    price: 180,
    distance: 2.3, // km
    available: "Hoje",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    coordinates: [-43.182365, -22.951878] as [number, number], // Rio coordinates with explicit type annotation
  },
  {
    id: 2,
    name: "Maria Souza",
    title: "Designer UX/UI",
    rating: 4.7,
    reviews: 98,
    price: 150,
    distance: 1.5,
    available: "Amanhã",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    coordinates: [-43.185365, -22.954878] as [number, number],
  },
  {
    id: 3,
    name: "Pedro Almeida",
    title: "Arquiteto de Software",
    rating: 4.8,
    reviews: 76,
    price: 220,
    distance: 3.8,
    available: "Hoje",
    image: "https://randomuser.me/api/portraits/men/62.jpg",
    coordinates: [-43.188365, -22.958878] as [number, number],
  },
  {
    id: 4,
    name: "Ana Costa",
    title: "Product Manager",
    rating: 4.5,
    reviews: 45,
    price: 190,
    distance: 5.1,
    available: "Em 2 dias",
    image: "https://randomuser.me/api/portraits/women/28.jpg",
    coordinates: [-43.192365, -22.961878] as [number, number],
  }
];

// Filter function to apply all filters at once
export const filterProfessionals = (
  professionals: Professional[],
  searchTerm: string,
  priceRange: number[],
  maxDistance: number,
  activeFilters: string[]
): Professional[] => {
  return professionals.filter(pro => {
    // Apply search term filter
    if (searchTerm && !pro.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !pro.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Apply price range filter
    if (pro.price < priceRange[0] || pro.price > priceRange[1]) {
      return false;
    }
    
    // Apply distance filter
    if (pro.distance > maxDistance) {
      return false;
    }
    
    // Apply specific filters
    if (activeFilters.includes("today") && pro.available !== "Hoje") {
      return false;
    }
    
    if (activeFilters.includes("highRated") && pro.rating < 4.8) {
      return false;
    }
    
    return true;
  });
};
