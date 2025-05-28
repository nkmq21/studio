
"use client";

import { ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8">
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
          <ShieldAlert className="w-10 h-10 mr-3 text-destructive" /> Admin Dashboard Overview
        </h1>
        <p className="text-muted-foreground text-lg">Welcome to the MotoRent admin panel. Manage bikes, rentals, and site operations using the sidebar navigation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Bike Fleet</CardTitle>
            <CardDescription>View, add, edit, or remove bikes from the catalog.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage all motorbikes available for rent. Update details, availability, and pricing.
            </p>
            <div className="flex justify-center">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/fleet">Go to Fleet Management <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Active Rentals</CardTitle>
            <CardDescription>Monitor bikes currently rented out to customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              See which bikes are on the road, who rented them, and when they are due back.
            </p>
            <div className="flex justify-center">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/rentals/active">View Active Rentals <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Upcoming Rentals</CardTitle>
            <CardDescription>Track future rental bookings and prepare accordingly.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Stay ahead by viewing scheduled pickups and ensuring bike availability.
            </p>
            <div className="flex justify-center">
              <Button asChild variant="outline" className="w-full">
                <Link href="/admin/rentals/upcoming">View Upcoming Rentals <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
