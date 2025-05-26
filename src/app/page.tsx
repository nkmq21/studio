"use client";

import MainLayout from '@/components/layout/main-layout';
import BikeCard from '@/components/bikes/bike-card';
import { MOCK_BIKES } from '@/lib/mock-data';
import type { Bike } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ListFilter, RefreshCw } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';

export default function HomePage() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [bikeTypeFilter, setBikeTypeFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setBikes(MOCK_BIKES);
      setIsLoading(false);
    }, 500);
  }, []);

  const bikeTypes = useMemo(() => ['all', ...new Set(MOCK_BIKES.map(bike => bike.type))], []);

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
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
      </MainLayout>
    );
  }


  return (
    <MainLayout>
      <div className="mb-8 p-6 bg-card rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-primary mb-2">Find Your Next Ride</h1>
        <p className="text-muted-foreground text-lg">Browse our extensive catalog of motorbikes available for rent.</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, location..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={bikeTypeFilter} onValueChange={setBikeTypeFilter}>
            <SelectTrigger className="w-full">
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

          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-full">
              <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Filter by Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={resetFilters} variant="outline" className="w-full lg:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" /> Reset Filters
          </Button>
        </div>
      </div>

      {filteredBikes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBikes.map(bike => (
            <BikeCard key={bike.id} bike={bike} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bike className="mx-auto h-24 w-24 text-muted-foreground opacity-50 mb-4" />
          <h2 className="text-2xl font-semibold text-muted-foreground">No Motorbikes Found</h2>
          <p className="text-foreground/70 mt-2">Try adjusting your search or filter criteria.</p>
          <Button onClick={resetFilters} variant="link" className="mt-4 text-primary">
            Clear all filters
          </Button>
        </div>
      )}
    </MainLayout>
  );
}
