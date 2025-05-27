
"use client";

import MainLayout from '@/components/layout/main-layout';
import BikeCard from '@/components/bikes/bike-card';
import { MOCK_BIKES } from '@/lib/mock-data';
import type { Bike } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ListFilter, RefreshCw, Bike as BikeIcon, CalendarDays, Menu, CalendarX } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

interface SelectedDates extends DateRange {
  from: Date;
  to: Date;
}

export default function BikesPage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bikeTypeFilter, setBikeTypeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDates, setSelectedDates] = useState<SelectedDates | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedDatesString = localStorage.getItem('motoRentSelectedDates');
    const storedLocationString = localStorage.getItem('motoRentSelectedLocation');

    if (!storedDatesString || !storedLocationString) {
      router.replace('/'); // Redirect to date selection if no dates/location are found
      return;
    }

    try {
      const parsedDates = JSON.parse(storedDatesString);
      if (parsedDates.from && parsedDates.to) {
        setSelectedDates({
          from: new Date(parsedDates.from),
          to: new Date(parsedDates.to),
        });
        setSelectedLocation(storedLocationString);
      } else {
        throw new Error("Invalid date format in localStorage");
      }
    } catch (error) {
      console.error("Failed to parse dates/location from localStorage:", error);
      localStorage.removeItem('motoRentSelectedDates');
      localStorage.removeItem('motoRentSelectedLocation');
      router.replace('/');
      return;
    }
    
    // Simulate fetching data
    setTimeout(() => {
      // Filter bikes by location if a specific location (not 'Any Location') is selected
      const bikesForLocation = selectedLocation && selectedLocation !== 'Any Location'
        ? MOCK_BIKES.filter(bike => bike.location === selectedLocation)
        : MOCK_BIKES;
      setBikes(bikesForLocation);
      setIsLoading(false);
    }, 500);
  }, [router, selectedLocation]); // Add selectedLocation to dependency array

  const bikeTypes = useMemo(() => {
     const allTypes = new Set(MOCK_BIKES.map(bike => bike.type));
    return ['all', ...Array.from(allTypes)];
  }, []);

  const filteredBikes = useMemo(() => {
    return bikes.filter(bike => {
      const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            bike.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            bike.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = bikeTypeFilter === 'all' || bike.type === bikeTypeFilter;
      const matchesAvailability = availabilityFilter === 'all' || 
                                  (availabilityFilter === 'available' && bike.isAvailable) ||
                                  (availabilityFilter === 'unavailable' && !bike.isAvailable);
      return matchesSearch && matchesType && matchesAvailability;
    });
  }, [bikes, searchTerm, bikeTypeFilter, availabilityFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setBikeTypeFilter('all');
    setAvailabilityFilter('all');
  };

  const handleChangeDatesAndLocation = () => {
    localStorage.removeItem('motoRentSelectedDates');
    localStorage.removeItem('motoRentSelectedLocation');
    router.push('/');
  };
  
  if ((!selectedDates || !selectedLocation) && !isLoading) { 
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-full">
          <p>Redirecting to select dates & location...</p>
        </div>
      </MainLayout>
    );
  }
  
  const FiltersComponent = () => (
    <>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by name, location..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="bikeTypeFilter" className="text-sm font-medium text-muted-foreground">Filter by Type</Label>
          <Select value={bikeTypeFilter} onValueChange={setBikeTypeFilter}>
            <SelectTrigger id="bikeTypeFilter" className="w-full mt-1">
              <ListFilter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              {bikeTypes.map(type => (
                <SelectItem key={type} value={type} className="capitalize">
                  {type === 'all' ? 'All Types' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="availabilityFilter" className="text-sm font-medium text-muted-foreground">Filter by Availability</Label>
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger id="availabilityFilter" className="w-full mt-1">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );


  return (
    <MainLayout>
      <SidebarProvider defaultOpen={true}> {/* Default open on desktop, controlled on mobile */}
        <Sidebar side="left" variant="sidebar" collapsible="icon" className="border-r bg-card">
          <SidebarHeader className="p-4">
            <h2 className="text-xl font-semibold text-primary">Filters</h2>
          </SidebarHeader>
          <Separator className="mb-2"/>
          <SidebarContent className="p-4">
            <FiltersComponent />
          </SidebarContent>
          <Separator className="mt-auto"/>
          <SidebarFooter className="p-4 space-y-2">
            <Button onClick={resetFilters} variant="outline" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" /> Reset Filters
            </Button>
            <Button onClick={handleChangeDatesAndLocation} variant="outline" className="w-full">
              <CalendarX className="h-4 w-4 mr-2" /> Change Dates/Location
            </Button>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className="p-1 md:p-0"> {/* Add some padding for mobile view of inset */}
            <div className="mb-6 p-4 bg-card rounded-lg shadow md:p-6">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-primary md:text-4xl">Find Your Next Ride</h1>
                <div className="md:hidden">
                  <SidebarTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">Toggle Filters</span>
                    </Button>
                  </SidebarTrigger>
                </div>
              </div>
              <p className="text-muted-foreground text-base md:text-lg">Browse our extensive catalog of motorbikes available for rent.</p>
              {selectedDates?.from && selectedDates?.to && selectedLocation && (
                <Alert className="mt-4 text-sm">
                  <CalendarDays className="h-4 w-4" />
                  <AlertTitle className="font-semibold">Selected Rental Details</AlertTitle>
                  <AlertDescription>
                    Location: {selectedLocation} <br/>
                    Period: {format(selectedDates.from, "PPP")} to {format(selectedDates.to, "PPP")}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> {/* Adjusted for sidebar */}
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse">
                    <div className="aspect-video bg-muted rounded-t-lg"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-10 bg-muted rounded w-full mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredBikes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> {/* Adjusted for sidebar */}
                {filteredBikes.map(bike => (
                  <BikeCard key={bike.id} bike={bike} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BikeIcon className="mx-auto h-24 w-24 text-muted-foreground opacity-50 mb-4" />
                <h2 className="text-2xl font-semibold text-muted-foreground">No Motorbikes Found</h2>
                <p className="text-foreground/70 mt-2">
                  No bikes match your current criteria or selected location.
                </p>
                <Button onClick={resetFilters} variant="link" className="mt-2 text-primary">
                  Clear all filters
                </Button>
                 <Button onClick={handleChangeDatesAndLocation} variant="link" className="mt-2 text-primary">
                  Change dates or location
                </Button>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </MainLayout>
  );
}

