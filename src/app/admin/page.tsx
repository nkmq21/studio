
"use client";

import { ShieldAlert, Users as UsersIconLucide, UserPlus, ArrowRight, Bike as BikeIcon, ListChecks, CalendarClock, Eye, TrendingUp, Repeat, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MOCK_USERS, MOCK_BIKES, MOCK_RENTALS } from '@/lib/mock-data';
import { useMemo } from 'react';
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import type { User } from '@/lib/types';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  link?: string;
  linkText?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, description, link, linkText }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-5 w-5 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
      {link && linkText && (
        <Button asChild variant="link" className="px-0 pt-2 text-xs h-auto">
          <Link href={link}>
            {linkText} <ArrowRight className="h-3 w-3 ml-1" />
          </Link>
        </Button>
      )}
    </CardContent>
  </Card>
);


export default function AdminOverviewPage() {
  const now = new Date();
  const periodRefs = useMemo(() => ({
    month: { start: startOfMonth(now), end: endOfMonth(now) },
    quarter: { start: startOfQuarter(now), end: endOfQuarter(now) },
    year: { start: startOfYear(now), end: endOfYear(now) },
  }), [now]); // Recalculate if 'now' changes significantly, though for client-side it's fine

  const userStats = useMemo(() => {
    const allUsers = MOCK_USERS.map(u => ({...u, createdAt: new Date(u.createdAt)})); // Ensure createdAt is Date object
    const total = allUsers.length;
    const thisMonth = allUsers.filter(u => isWithinInterval(u.createdAt, periodRefs.month)).length;
    const thisQuarter = allUsers.filter(u => isWithinInterval(u.createdAt, periodRefs.quarter)).length;
    const thisYear = allUsers.filter(u => isWithinInterval(u.createdAt, periodRefs.year)).length;
    return { total, thisMonth, thisQuarter, thisYear };
  }, [periodRefs.month, periodRefs.quarter, periodRefs.year]);
  
  const totalBikes = useMemo(() => MOCK_BIKES.length, []);
  
  const rentalStats = useMemo(() => {
    const active = MOCK_RENTALS.filter(r => r.status === 'Active').length;
    const upcoming = MOCK_RENTALS.filter(r => r.status === 'Upcoming').length;
    const completed = MOCK_RENTALS.filter(r => r.status === 'Completed').length;
    
    const bikeRentalCounts: Record<string, number> = {};
    MOCK_RENTALS.forEach(rental => {
      bikeRentalCounts[rental.bikeId] = (bikeRentalCounts[rental.bikeId] || 0) + 1;
    });

    let popularBikeName = "N/A";
    if (Object.keys(bikeRentalCounts).length > 0) {
      const mostPopularId = Object.keys(bikeRentalCounts).reduce((a, b) => bikeRentalCounts[a] > bikeRentalCounts[b] ? a : b);
      const popularBike = MOCK_BIKES.find(bike => bike.id === mostPopularId);
      popularBikeName = popularBike ? popularBike.name : "Unknown Bike";
    }
    
    return { active, upcoming, completed, popularBikeName };
  }, []);

  const metricCards: MetricCardProps[] = [
    { title: "Total Registered Users", value: userStats.total, icon: UsersIconLucide, description: "All-time user count", link: "/admin/users", linkText: "Manage Users"},
    { title: "New Users (This Month)", value: userStats.thisMonth, icon: UserPlus, description: "Signed up this month" },
    { title: "New Users (This Quarter)", value: userStats.thisQuarter, icon: UserPlus, description: "Signed up this quarter" },
    { title: "New Users (This Year)", value: userStats.thisYear, icon: UserPlus, description: "Signed up this year" },
    { title: "Total Bikes", value: totalBikes, icon: BikeIcon, description: "Bikes in fleet", link: "/admin/fleet", linkText: "Manage Fleet" },
    { title: "Active Rentals", value: rentalStats.active, icon: ListChecks, description: "Currently rented out", link: "/admin/rentals/active", linkText: "View Active" },
    { title: "Upcoming Rentals", value: rentalStats.upcoming, icon: CalendarClock, description: "Future bookings", link: "/admin/rentals/upcoming", linkText: "View Upcoming" },
    { title: "Most Popular Bike", value: rentalStats.popularBikeName, icon: TrendingUp, description: "Based on rental count" },
    { title: "Completed Rentals", value: rentalStats.completed, icon: Repeat, description: "Total past rentals" },
    { title: "Total Bookings", value: MOCK_RENTALS.length, icon: ShoppingBag, description: "All-time rental bookings" },
    { title: "Website Visits", value: "1,234", icon: Eye, description: "This month (placeholder)" },
  ];

  const navigationCardItems = [
    {
      title: "Fleet Management",
      description: "View, add, edit, or remove bikes from the catalog.",
      details: "Manage all motorbikes available for rent. Update details, availability, and pricing.",
      href: "/admin/fleet",
      linkText: "Fleet Management",
      icon: BikeIcon,
    },
    {
      title: "Active Rentals",
      description: "Monitor bikes currently rented out to customers.",
      details: "See which bikes are on the road, who rented them, and when they are due back.",
      href: "/admin/rentals/active",
      linkText: "Active Rentals",
      icon: ListChecks,
    },
    {
      title: "Upcoming Rentals",
      description: "Track future rental bookings and prepare accordingly.",
      details: "Stay ahead by viewing scheduled pickups and ensuring bike availability.",
      href: "/admin/rentals/upcoming",
      linkText: "Upcoming Rentals",
      icon: CalendarClock,
    },
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions.",
      details: "View all registered users, modify their roles, or remove accounts as needed.",
      href: "/admin/users",
      linkText: "User Management",
      icon: UsersIconLucide,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
          <ShieldAlert className="w-10 h-10 mr-3 text-destructive" /> Admin Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Welcome to the VroomVroom.vn admin panel. Get an overview of your operations and navigate to management sections.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Key Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {metricCards.map((metric) => (
            <MetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              description={metric.description}
              link={metric.link}
              linkText={metric.linkText}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground/90">Management Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"> {/* Adjusted to lg:grid-cols-2 for better fit with 4 items */}
          {navigationCardItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card key={item.title} className="hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <IconComponent className="w-6 h-6 mr-2 text-primary" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow p-6 pt-0">
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">
                    {item.details}
                  </p>
                  <div className="mt-auto">
                    <Button asChild variant="outline" className="w-full">
                      <Link href={item.href} className="truncate">
                        {item.linkText}
                        <ArrowRight className="h-4 w-4 ml-2" /> {/* Added ml-2 for spacing */}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
