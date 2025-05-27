
import type { Bike, User, Rental } from './types';
import { addDays } from 'date-fns';

export const MOCK_USERS: User[] = [
  { id: 'user1', email: 'renter@motorent.com', name: 'Alice Wonderland', role: 'renter', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user2', email: 'admin@motorent.com', name: 'Bob The Builder', role: 'admin', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user3', email: 'staff@motorent.com', name: 'Charlie Brown', role: 'staff', avatarUrl: 'https://placehold.co/100x100.png' },
];

export const MOCK_BIKES: Bike[] = [
  {
    id: 'bike1',
    name: 'Urban Sprinter Z250',
    type: 'Scooter',
    imageUrl: 'https://placehold.co/600x400.png',
    pricePerDay: 45,
    description: 'Navigate the city streets with ease on this agile and fuel-efficient scooter. Perfect for daily commutes and quick errands.',
    features: ['Automatic Transmission', 'ABS', 'LED Headlights', 'USB Charger', 'Under-seat Storage'],
    location: 'Downtown Central',
    rating: 4.5,
    isAvailable: true,
    amount: 10,
  },
  {
    id: 'bike2',
    name: 'Adventure Pro 500X',
    type: 'Adventure',
    imageUrl: 'https://placehold.co/600x400.png',
    pricePerDay: 75,
    description: 'Conquer any terrain with this rugged adventure bike. Equipped for long journeys and off-road exploration.',
    features: ['Manual 6-Speed', 'Switchable ABS', 'Spoke Wheels', 'Luggage Racks', 'Windscreen'],
    location: 'Mountain Pass Rentals',
    rating: 4.8,
    isAvailable: true,
    amount: 5,
  },
  {
    id: 'bike3',
    name: 'Speedster R1000',
    type: 'Sport',
    imageUrl: 'https://placehold.co/600x400.png',
    pricePerDay: 120,
    description: 'Experience thrilling performance with this high-powered sportbike. Precision handling and blistering acceleration.',
    features: ['Manual 6-Speed', 'Quick Shifter', 'Traction Control', 'Full Fairing', 'Performance Exhaust'],
    location: 'Speedway Rentals Co.',
    rating: 4.9,
    isAvailable: false,
    amount: 3,
  },
  {
    id: 'bike4',
    name: 'Classic Rider V-Twin',
    type: 'Cruiser',
    imageUrl: 'https://placehold.co/600x400.png',
    pricePerDay: 90,
    description: 'Ride in style with this iconic V-twin cruiser. Timeless design combined with modern comfort for the open road.',
    features: ['Manual 5-Speed', 'Chrome Accents', 'Leather Saddlebags', 'Comfort Seat', 'Loud Pipes'],
    location: 'Route 66 Motorbikes',
    rating: 4.7,
    isAvailable: true,
    amount: 7,
  },
  {
    id: 'bike5',
    name: 'EcoVolt Commuter',
    type: 'Electric',
    imageUrl: 'https://placehold.co/600x400.png',
    pricePerDay: 55,
    description: 'Silent, eco-friendly, and zippy. The ideal electric scooter for sustainable urban mobility.',
    features: ['Automatic', 'Regenerative Braking', 'Digital Display', 'Removable Battery', 'Quiet Operation'],
    location: 'GreenWheels Hub',
    rating: 4.3,
    isAvailable: true,
    amount: 12,
  },
];

// Add data-ai-hint to imageUrls after definition
MOCK_BIKES.find(b => b.id === 'bike1')!.imageUrl = 'https://placehold.co/600x400.png" data-ai-hint="scooter city';
MOCK_BIKES.find(b => b.id === 'bike2')!.imageUrl = 'https://placehold.co/600x400.png" data-ai-hint="adventure motorcycle';
MOCK_BIKES.find(b => b.id === 'bike3')!.imageUrl = 'https://placehold.co/600x400.png" data-ai-hint="sport motorcycle';
MOCK_BIKES.find(b => b.id === 'bike4')!.imageUrl = 'https://placehold.co/600x400.png" data-ai-hint="classic motorcycle';
MOCK_BIKES.find(b => b.id === 'bike5')!.imageUrl = 'https://placehold.co/600x400.png" data-ai-hint="electric scooter';


export const MOCK_RENTALS: Rental[] = [
  {
    id: 'rental1',
    bikeId: 'bike1',
    userId: 'user1',
    startDate: addDays(new Date(), -10),
    endDate: addDays(new Date(), -7),
    totalPrice: 45 * 3,
    options: ['helmet'],
    status: 'Completed',
    bikeName: MOCK_BIKES.find(b => b.id === 'bike1')!.name,
    bikeImageUrl: MOCK_BIKES.find(b => b.id === 'bike1')!.imageUrl,
    orderDate: addDays(new Date(), -12),
  },
  {
    id: 'rental2',
    bikeId: 'bike2',
    userId: 'user1',
    startDate: addDays(new Date(), 2),
    endDate: addDays(new Date(), 5),
    totalPrice: 75 * 3,
    options: ['helmet', 'insurance'],
    status: 'Upcoming',
    bikeName: MOCK_BIKES.find(b => b.id === 'bike2')!.name,
    bikeImageUrl: MOCK_BIKES.find(b => b.id === 'bike2')!.imageUrl,
    orderDate: addDays(new Date(), -1),
  },
  {
    id: 'rental3',
    bikeId: 'bike4',
    userId: 'user1',
    startDate: addDays(new Date(), -30),
    endDate: addDays(new Date(), -25),
    totalPrice: 90 * 5,
    options: ['helmet', 'saddlebags'],
    status: 'Completed',
    bikeName: MOCK_BIKES.find(b => b.id === 'bike4')!.name,
    bikeImageUrl: MOCK_BIKES.find(b => b.id === 'bike4')!.imageUrl,
    orderDate: addDays(new Date(), -32),
  },
];

export const RENTAL_OPTIONS = [
  { id: 'helmet', name: 'Helmet', price: 5, selected: false },
  { id: 'insurance', name: 'Full Coverage Insurance', price: 15, selected: false },
  { id: 'gps', name: 'GPS Navigation', price: 10, selected: false },
  { id: 'luggage', name: 'Side Luggage Panniers', price: 12, selected: false },
];
