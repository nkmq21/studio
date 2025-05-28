
export type UserRole = 'renter' | 'admin' | 'staff';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Bike {
  id: string;
  name: string;
  type: 'Scooter' | 'Sport' | 'Cruiser' | 'Adventure' | 'Electric';
  imageUrl: string;
  pricePerDay: number;
  description: string;
  features: string[];
  location: string; 
  rating?: number; // Optional: 1-5 stars
  isAvailable?: boolean; // Simplified availability
  amount: number; // Total stock of this bike model
  cylinderVolume?: number; // Optional: in cc
}

export interface Rental {
  id:string;
  bikeId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  options: string[]; // e.g., 'helmet', 'insurance'
  status: 'Upcoming' | 'Active' | 'Completed' | 'Cancelled';
  // Denormalized data for easier display
  bikeName: string; 
  bikeImageUrl: string;
  orderDate: Date;
  // quantity?: number; // Future: if a single rental record can be for multiple bikes
}

export interface OrderDetails {
  bike: Bike;
  startDate: Date;
  endDate: Date;
  options: { id: string, name: string, price: number, selected: boolean }[];
  totalPrice: number;
  numDays: number;
  quantityRented: number; // Added quantity
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'staff' | 'system'; // Added 'system' for mode switch messages
  timestamp: Date;
}
