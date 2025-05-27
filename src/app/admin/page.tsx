
"use client";

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Bike as BikeIconLucide, ListChecks, CalendarClock, PlusCircle, Pencil, Trash2 } from 'lucide-react'; // Updated icons
import { MOCK_BIKES } from '@/lib/mock-data';
import type { Bike } from '@/lib/types';

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [bikes, setBikes] = useState<Bike[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace('/auth/login?redirect=/admin');
      } else if (user?.role !== 'admin') {
        router.replace('/'); 
      }
    }
  }, [user, isAuthenticated, loading, router]);

  useEffect(() => {
    // Load bikes data (in a real app, this would be an API call)
    setBikes(MOCK_BIKES);
  }, []);

  if (loading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p>Loading or unauthorized...</p>
        </div>
      </MainLayout>
    );
  }

  const handleAddNewBike = () => {
    // Placeholder for future functionality
    alert('Add new bike functionality to be implemented.');
  };

  const handleEditBike = (bikeId: string) => {
    // Placeholder for future functionality
    alert(`Edit bike ${bikeId} functionality to be implemented.`);
  };

  const handleDeleteBike = (bikeId: string) => {
    // Placeholder for future functionality
    if (confirm(`Are you sure you want to delete bike ${bikeId}? This action cannot be undone.`)) {
      alert(`Delete bike ${bikeId} functionality to be implemented.`);
      // setBikes(prevBikes => prevBikes.filter(b => b.id !== bikeId)); // Example of local state update
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
          <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
            <ShieldAlert className="w-10 h-10 mr-3 text-destructive" /> Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage bikes, rentals, and site operations.</p>
        </div>

        {/* Bike Fleet Management Card */}
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-xl font-semibold flex items-center">
                <BikeIconLucide className="h-6 w-6 mr-2 text-primary" /> Bike Fleet Management
              </CardTitle>
              <CardDescription>View, add, edit, or remove bikes from the catalog.</CardDescription>
            </div>
            <Button onClick={handleAddNewBike}>
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Bike
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price/Day</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bikes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      No bikes in the catalog yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  bikes.map((bike) => (
                    <TableRow key={bike.id}>
                      <TableCell className="font-medium">{bike.name}</TableCell>
                      <TableCell>{bike.type}</TableCell>
                      <TableCell>${bike.pricePerDay.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={bike.isAvailable ? "secondary" : "destructive"}>
                          {bike.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditBike(bike.id)}>
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit Bike</span>
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDeleteBike(bike.id)}>
                          <Trash2 className="h-4 w-4" />
                           <span className="sr-only">Delete Bike</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Rental Status Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <ListChecks className="h-5 w-5 mr-2 text-primary" />Current Rental Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                (Placeholder) This section will display bikes currently rented out, who rented them, and their expected return dates.
              </p>
              {/* Future: Table or list of active rentals */}
            </CardContent>
          </Card>

          {/* Upcoming Rental Appointments Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <CalendarClock className="h-5 w-5 mr-2 text-primary" />Upcoming Rental Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                (Placeholder) This section will show a list of upcoming bike rental bookings, including bike details, renter information, and rental period.
              </p>
              {/* Future: Table or list of upcoming rentals */}
            </CardContent>
          </Card>
        </div>

      </div>
    </MainLayout>
  );
}

    