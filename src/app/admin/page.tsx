
"use client";

import { useEffect, useState, useMemo } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, Bike as BikeIconLucide, ListChecks, CalendarClock, PlusCircle, Pencil, Trash2, Users, Clock } from 'lucide-react';
import { MOCK_BIKES, MOCK_RENTALS, MOCK_USERS } from '@/lib/mock-data';
import type { Bike, Rental, User as AppUser } from '@/lib/types';
import BikeFormDialog, { type BikeFormData } from '@/components/admin/bike-form-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';

interface EnrichedRental extends Rental {
  renterName?: string;
  bikeName?: string; 
}

export default function AdminPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isBikeFormOpen, setIsBikeFormOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState<Bike | null>(null);

  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);


  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/auth/login?redirect=/admin');
      } else if (user?.role !== 'admin') {
        router.replace('/'); 
      }
    }
  }, [user, isAuthenticated, authLoading, router]);

  useEffect(() => {
    setBikes(MOCK_BIKES);
    setAllRentals(MOCK_RENTALS);
    setAllUsers(MOCK_USERS);
  }, []);

  const activeRentals: EnrichedRental[] = useMemo(() => {
    return allRentals
      .filter(r => r.status === 'Active')
      .map(r => ({
        ...r,
        renterName: allUsers.find(u => u.id === r.userId)?.name || 'Unknown User',
        bikeName: bikes.find(b => b.id === r.bikeId)?.name || r.bikeName || 'Unknown Bike',
      }))
      .sort((a,b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
  }, [allRentals, allUsers, bikes]);

  const upcomingAppointments: EnrichedRental[] = useMemo(() => {
    return allRentals
      .filter(r => r.status === 'Upcoming')
      .map(r => ({
        ...r,
        renterName: allUsers.find(u => u.id === r.userId)?.name || 'Unknown User',
        bikeName: bikes.find(b => b.id === r.bikeId)?.name || r.bikeName || 'Unknown Bike',
      }))
      .sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [allRentals, allUsers, bikes]);


  if (authLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading or unauthorized...</p>
        </div>
      </MainLayout>
    );
  }

  const handleAddNewBike = () => {
    setEditingBike(null);
    setIsBikeFormOpen(true);
  };

  const handleEditBike = (bikeToEdit: Bike) => {
    setEditingBike(bikeToEdit);
    setIsBikeFormOpen(true);
  };

  const handleDeleteBikeConfirm = (bikeId: string) => {
    setBikes(prevBikes => prevBikes.filter(b => b.id !== bikeId));
    toast({ title: "Bike Deleted", description: `Bike ${bikeId} has been removed.` });
    setBikeToDelete(null); 
  };

  const handleBikeFormSubmit = async (data: BikeFormData, bikeIdToUpdate?: string) => {
    setFormSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 700));

    const bikeDataFromForm: Omit<Bike, 'id' | 'rating'> & { rating?: number | null } = {
      name: data.name,
      type: data.type,
      imageUrl: data.imageUrl,
      pricePerDay: data.pricePerDay,
      description: data.description,
      features: data.features.split(',').map(f => f.trim()).filter(f => f),
      location: data.location,
      isAvailable: data.isAvailable,
      rating: data.rating === null ? undefined : data.rating,
    };
    
    if (bikeIdToUpdate) {
      setBikes(prevBikes => prevBikes.map(b => 
        b.id === bikeIdToUpdate ? { ...b, ...bikeDataFromForm, id: bikeIdToUpdate } : b
      ));
      toast({ title: "Bike Updated", description: `${data.name} has been updated.`});
    } else { 
      const newBike: Bike = {
        ...bikeDataFromForm,
        id: `bike${Date.now()}-${Math.random().toString(36).substring(2,7)}`,
        rating: bikeDataFromForm.rating,
      };
      setBikes(prevBikes => [newBike, ...prevBikes]);
      toast({ title: "Bike Added", description: `${newBike.name} has been added to the catalog.`});
    }
    setFormSubmitting(false);
    setIsBikeFormOpen(false);
    setEditingBike(null);
  };


  return (
    <MainLayout>
      <AlertDialog open={!!bikeToDelete} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setBikeToDelete(null);
        }
      }}>
        <div className="space-y-8">
          <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
            <h1 className="text-4xl font-bold text-primary mb-2 flex items-center">
              <ShieldAlert className="w-10 h-10 mr-3 text-destructive" /> Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">Manage bikes, rentals, and site operations.</p>
          </div>

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
                    <TableHead className="w-[200px]">Name</TableHead>
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
                          <Button variant="outline" size="icon" onClick={() => handleEditBike(bike)}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit Bike</span>
                          </Button>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" onClick={() => setBikeToDelete(bike)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete Bike</span>
                            </Button>
                          </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <ListChecks className="h-5 w-5 mr-2 text-primary" />Current Rental Status
                </CardTitle>
                <Badge variant="outline">{activeRentals.length} Active</Badge>
              </CardHeader>
              <CardContent>
                {activeRentals.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {activeRentals.map(rental => (
                      <div key={rental.id} className="p-3 border rounded-md text-sm">
                        <p className="font-semibold text-primary">{rental.bikeName}</p>
                        <p className="text-xs text-muted-foreground flex items-center"><Users className="w-3 h-3 mr-1.5"/> Rented by: {rental.renterName}</p>
                        <p className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1.5"/>Return: {format(new Date(rental.endDate), "PPP 'at' p")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No bikes are currently rented out.</p>
                )}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <CalendarClock className="h-5 w-5 mr-2 text-primary" />Upcoming Rental Appointments
                </CardTitle>
                <Badge variant="outline">{upcomingAppointments.length} Upcoming</Badge>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {upcomingAppointments.map(rental => (
                      <div key={rental.id} className="p-3 border rounded-md text-sm">
                        <p className="font-semibold text-primary">{rental.bikeName}</p>
                        <p className="text-xs text-muted-foreground flex items-center"><Users className="w-3 h-3 mr-1.5"/>Booked by: {rental.renterName}</p>
                        <p className="text-xs text-muted-foreground flex items-center"><Clock className="w-3 h-3 mr-1.5"/>Period: {format(new Date(rental.startDate), "PPP")} - {format(new Date(rental.endDate), "PPP")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming rental bookings.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <BikeFormDialog
          open={isBikeFormOpen}
          onOpenChange={setIsBikeFormOpen}
          onSubmit={handleBikeFormSubmit}
          bikeToEdit={editingBike}
          isLoading={formSubmitting}
        />

        <AlertDialogContent>
          {bikeToDelete && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the bike
                  "{bikeToDelete.name}" from the catalog.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteBikeConfirm(bikeToDelete.id)}>
                  Yes, delete bike
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
