
"use client";

import { ShieldAlert, Users as UsersIconLucide, ArrowRight, Bike as BikeIcon, ListChecks, CalendarClock, LayoutDashboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AdminOverviewPage() {
  const cardItems = [
    {
      title: "Fleet Management",
      description: "View, add, edit, or remove bikes from the catalog.",
      details: "Manage all motorbikes available for rent. Update details, availability, and pricing.",
      href: "/admin/fleet",
      linkText: "Fleet Management", // Updated
      icon: BikeIcon,
    },
    {
      title: "Active Rentals",
      description: "Monitor bikes currently rented out to customers.",
      details: "See which bikes are on the road, who rented them, and when they are due back.",
      href: "/admin/rentals/active",
      linkText: "Active Rentals", // Updated
      icon: ListChecks,
    },
    {
      title: "Upcoming Rentals",
      description: "Track future rental bookings and prepare accordingly.",
      details: "Stay ahead by viewing scheduled pickups and ensuring bike availability.",
      href: "/admin/rentals/upcoming",
      linkText: "Upcoming Rentals", // Updated
      icon: CalendarClock,
    },
    {
      title: "User Management",
      description: "Manage user accounts, roles, and permissions.",
      details: "View all registered users, modify their roles, or remove accounts as needed.",
      href: "/admin/users",
      linkText: "User Management", // Updated
      icon: UsersIconLucide,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
          <ShieldAlert className="w-10 h-10 mr-3 text-destructive" /> Admin Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-lg">Welcome to the MotoRent admin panel. Manage bikes, rentals, users, and site operations using the sidebar navigation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <Card key={item.title} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <IconComponent className="w-5 h-5 mr-2 text-primary" />
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
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
