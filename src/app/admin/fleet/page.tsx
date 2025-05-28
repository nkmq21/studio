
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Bike as BikeIconLucide, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { MOCK_BIKES } from '@/lib/mock-data';
import type { Bike } from '@/lib/types';
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

export default function BikeFleetPage() {
  const { toast } = useToast();

  const [bikes, setBikes] = useState<Bike[]>([]);
  const [isBikeFormOpen, setIsBikeFormOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [bikeToDelete, setBikeToDelete] = useState<Bike | null>(null);

  useEffect(() => {
    // Simulate fetching bikes
    setBikes(MOCK_BIKES);
  }, []);

  const handleAddNewBike = () => {
    setEditingBike(null);
    setIsBikeFormOpen(true);
  };

  const handleEditBike = (bikeToEdit: Bike) => {
    setEditingBike(bikeToEdit);
    setIsBikeFormOpen(true);
  };

  const handleDeleteBikeConfirm = (bikeId: string) => {
    // In a real app, call an API to delete the bike
    setBikes(prevBikes => prevBikes.filter(b => b.id !== bikeId));
    toast({ title: "Bike Deleted", description: `Bike ${bikeId} has been removed.` });
    setBikeToDelete(null);
  };

  const handleBikeFormSubmit = async (data: BikeFormData, bikeIdToUpdate?: string) => {
    setFormSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));

    const bikeDataFromForm: Omit<Bike, 'id' | 'rating'> & { rating?: number | null } = {
      name: data.name,
      type: data.type,
      imageUrl: data.imageUrl,
      pricePerDay: data.pricePerDay,
      amount: data.amount,
      description: data.description,
      features: data.features.split(',').map(f => f.trim()).filter(f => f),
      location: data.location,
      isAvailable: data.isAvailable,
      rating: data.rating === null ? undefined : data.rating,
    };

    if (bikeIdToUpdate) {
      // In a real app, call an API to update the bike
      setBikes(prevBikes => prevBikes.map(b =>
        b.id === bikeIdToUpdate ? { ...b, ...bikeDataFromForm, id: bikeIdToUpdate } : b
      ));
      toast({ title: "Bike Updated", description: `${data.name} has been updated.`});
    } else {
      // In a real app, call an API to add the bike, get back the ID
      const newBike: Bike = {
        ...bikeDataFromForm,
        id: `bike${Date.now()}-${Math.random().toString(36).substring(2,7)}`, // Mock ID generation
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
    <AlertDialog open={!!bikeToDelete} onOpenChange={(isOpen) => {
      if (!isOpen) {
        setBikeToDelete(null);
      }
    }}>
      <div className="space-y-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-2xl font-semibold flex items-center">
                <BikeIconLucide className="h-7 w-7 mr-2 text-primary" /> Bike Fleet Management
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bikes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                      No bikes in the catalog yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  bikes.map((bike) => (
                    <TableRow key={bike.id}>
                      <TableCell className="font-medium">{bike.name}</TableCell>
                      <TableCell>{bike.type}</TableCell>
                      <TableCell>${bike.pricePerDay.toFixed(2)}</TableCell>
                      <TableCell>{bike.amount}</TableCell>
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
  );
}
