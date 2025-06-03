
"use client";

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MOCK_RENTALS, MOCK_USERS, MOCK_BIKES } from '@/lib/mock-data';
import type { Rental, User as AppUser, Bike } from '@/lib/types';
import { format, isValid, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { UserCheck, CalendarIcon, MapPin, FilterX, Bike as BikeIconLucide, Users, Clock, ListChecks, CalendarClock } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface EnrichedRental extends Rental {
  renterName?: string;
  bikeName?: string;
  bikeLocation?: string;
}

export default function StaffRentalManagementPage() {
  const [allRentals, setAllRentals] = useState<Rental[]>([]);
  const [allUsers, setAllUsers] = useState<AppUser[]>([]);
  const [allBikes, setAllBikes] = useState<Bike[]>([]);

  const [filterDateRange, setFilterDateRange] = useState<DateRange | undefined>(undefined);
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    // Simulate fetching data
    setAllRentals(MOCK_RENTALS);
    setAllUsers(MOCK_USERS);
    setAllBikes(MOCK_BIKES);
  }, []);

  const availableLocations = useMemo(() => {
    const locations = new Set(MOCK_BIKES.map(bike => bike.location));
    return ['all', ...Array.from(locations)];
  }, [allBikes]);

  const enrichedRentals: EnrichedRental[] = useMemo(() => {
    return allRentals.map(r => {
      const renter = allUsers.find(u => u.id === r.userId);
      const bike = allBikes.find(b => b.id === r.bikeId);
      return {
        ...r,
        renterName: renter?.name || 'Unknown User',
        bikeName: bike?.name || r.bikeName || 'Unknown Bike',
        bikeLocation: bike?.location || 'Unknown Location',
      };
    });
  }, [allRentals, allUsers, allBikes]);

  const filteredEnrichedRentals = useMemo(() => {
    return enrichedRentals.filter(rental => {
      const matchesLocation = filterLocation === 'all' || rental.bikeLocation === filterLocation;

      let matchesDate = true;
      if (filterDateRange?.from && filterDateRange?.to) {
        const rentalStart = startOfDay(new Date(rental.startDate));
        const rentalEnd = endOfDay(new Date(rental.endDate));
        const filterStart = startOfDay(filterDateRange.from);
        const filterEnd = endOfDay(filterDateRange.to);

        // Check if rental period overlaps with filter period
        matchesDate = isWithinInterval(rentalStart, { start: filterStart, end: filterEnd }) ||
                      isWithinInterval(rentalEnd, { start: filterStart, end: filterEnd }) ||
                      (rentalStart <= filterStart && rentalEnd >= filterEnd);
      } else if (filterDateRange?.from) { // Only start date selected, show rentals active on or after this date
        const rentalEnd = endOfDay(new Date(rental.endDate));
        const filterStart = startOfDay(filterDateRange.from);
        matchesDate = rentalEnd >= filterStart;
      }
      return matchesLocation && matchesDate;
    });
  }, [enrichedRentals, filterDateRange, filterLocation]);


  const activeRentals = useMemo(() => {
    return filteredEnrichedRentals
      .filter(r => r.status === 'Active')
      .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime()); // Sort by nearest return date
  }, [filteredEnrichedRentals]);

  const upcomingRentals = useMemo(() => {
    return filteredEnrichedRentals
      .filter(r => r.status === 'Upcoming')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()); // Sort by nearest start date
  }, [filteredEnrichedRentals]);

  const resetFilters = () => {
    setFilterDateRange(undefined);
    setFilterLocation('all');
  };

  const RentalInfoCard = ({ rental }: { rental: EnrichedRental }) => (
    <Card className="bg-card-foreground/5 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-md font-semibold text-primary flex items-center">
          <BikeIconLucide className="w-4 h-4 mr-1.5" />{rental.bikeName}
        </CardTitle>
        <CardDescription className="text-xs">Location: {rental.bikeLocation}</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-3 text-xs space-y-0.5">
        <p className="text-muted-foreground flex items-center"><Users className="w-3 h-3 mr-1"/>Rented by: {rental.renterName}</p>
        <p className="text-muted-foreground flex items-center">
            <Clock className="w-3 h-3 mr-1"/>
            {rental.status === 'Active' ? 'Return:' : 'Starts:'} {format(new Date(rental.status === 'Active' ? rental.endDate : rental.startDate), "PP")}
        </p>
        <p className="text-muted-foreground flex items-center"><CalendarIcon className="w-3 h-3 mr-1"/>Period: {format(new Date(rental.startDate), "PP")} - {format(new Date(rental.endDate), "PP")}</p>
        <p className="text-muted-foreground mt-1">ID: {rental.id}</p>
      </CardContent>
      {/* Add actions like "Mark as Picked Up" or "Mark as Returned" if needed in the future */}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center">
            <ListChecks className="h-7 w-7 mr-2 text-primary" /> Rental Operations
          </CardTitle>
          <CardDescription>View and manage active and upcoming rentals. Filter by date and location.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 border rounded-lg bg-background space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
            <div className="flex-grow">
              <Label htmlFor="dateRangeStaff" className="text-sm font-medium">Filter by Date Range</Label>
              <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="dateRangeStaff"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal mt-1"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filterDateRange?.from ? (
                      filterDateRange.to ? (
                        <>
                          {format(filterDateRange.from, "LLL dd, y")} - {format(filterDateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(filterDateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={filterDateRange?.from}
                    selected={filterDateRange}
                    onSelect={(range) => {
                      setFilterDateRange(range);
                      // setIsDatePickerOpen(false); // Optional: close on select
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex-grow">
              <Label htmlFor="locationFilterStaff" className="text-sm font-medium">Filter by Location</Label>
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger id="locationFilterStaff" className="w-full mt-1">
                  <MapPin className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {availableLocations.map(loc => (
                    <SelectItem key={loc} value={loc} className="capitalize">
                      {loc === 'all' ? 'All Locations' : loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={resetFilters} variant="outline" className="md:ml-auto">
              <FilterX className="mr-2 h-4 w-4" /> Clear Filters
            </Button>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="active"><ListChecks className="mr-2 h-4 w-4"/>Active ({activeRentals.length})</TabsTrigger>
              <TabsTrigger value="upcoming"><CalendarClock className="mr-2 h-4 w-4"/>Upcoming ({upcomingRentals.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {activeRentals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 max-h-[60vh] overflow-y-auto pr-2">
                  {activeRentals.map(rental => <RentalInfoCard key={rental.id} rental={rental} />)}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No active rentals match your filters.</p>
              )}
            </TabsContent>
            <TabsContent value="upcoming">
              {upcomingRentals.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 max-h-[60vh] overflow-y-auto pr-2">
                  {upcomingRentals.map(rental => <RentalInfoCard key={rental.id} rental={rental} />)}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No upcoming rentals match your filters.</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
