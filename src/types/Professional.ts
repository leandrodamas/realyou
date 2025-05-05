
export interface Professional {
  id: string | number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  distance: number;
  available: string;
  image: string;
  coordinates: [number, number]; // Explicitly typed as tuple
}
