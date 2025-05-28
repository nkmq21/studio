
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { MOCK_BIKES, MOCK_RENTALS, RENTAL_OPTIONS } from '@/lib/mock-data';
import type { Bike, OrderDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from 'react-day-picker';
import { addDays, differenceInDays, format } from 'date-fns';
import { Tag, Star, DollarSign, MapPinIcon, Settings, CalendarDays, ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function BikeDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [bike, setBike] = useState<Bike | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const [selectedOptions, setSelectedOptions] = useState<typeof RENTAL_OPTIONS>(
    RENTAL_OPTIONS.map(opt => ({ ...opt, selected: false }))
  );
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [isAvailableForDates, setIsAvailableForDates] = useState<boolean | null>(null);

  useEffect(() => {
    if (params.id) {
      const foundBike = MOCK_BIKES.find(b => b.id === params.id);
      setBike(foundBike || null);
    }
  }, [params.id]);

  useEffect(() => {
    if (bike && dateRange?.from && dateRange?.to) {
      const days = differenceInDays(dateRange.to, dateRange.from) + 1;
      setNumberOfDays(days > 0 ? days : 0);
      const optionsPrice = selectedOptions.reduce((sum, opt) => opt.selected ? sum + opt.price : sum, 0);
      setTotalPrice(days > 0 ? (bike.pricePerDay * days) + (optionsPrice * days) : 0);
    } else {
      setTotalPrice(0);
      setNumberOfDays(0);
    }
  }, [bike, dateRange, selectedOptions]);

  useEffect(() => {
    if (!bike || !dateRange?.from || !dateRange?.to) {
      setIsAvailableForDates(null); // Not enough info to check
      return;
    }

    if (!bike.isAvailable) { // General availability check first
      setIsAvailableForDates(false);
      return;
    }

    const selectedStartTime = dateRange.from.getTime();
    const selectedEndTime = dateRange.to.getTime();

    const hasOverlappingRental = MOCK_RENTALS.some(rental => {
      if (rental.bikeId === bike.id && (rental.status === 'Active' || rental.status === 'Upcoming')) {
        const rentalStartTime = new Date(rental.startDate).getTime();
        const rentalEndTime = new Date(rental.endDate).getTime();
        // Check for overlap: (StartA <= EndB) and (EndA >= StartB)
        return selectedStartTime <= rentalEndTime && selectedEndTime >= rentalStartTime;
      }
      return false;
    });

    setIsAvailableForDates(!hasOverlappingRental);

  }, [bike, dateRange]); // MOCK_RENTALS is stable, not needed in deps for this mock


  const handleOptionChange = (optionId: string) => {
    setSelectedOptions(prevOptions =>
      prevOptions.map(opt =>
        opt.id === optionId ? { ...opt, selected: !opt.selected } : opt
      )
    );
  };

  const handleRentNow = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to rent a motorbike.",
        variant: "destructive",
      });
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!bike || !dateRange?.from || !dateRange?.to || numberOfDays <= 0 || isAvailableForDates !== true) {
      toast({
        title: "Rental Not Possible",
        description: "Please select a valid date range for an available bike.",
        variant: "destructive",
      });
      return;
    }

    const orderDetails: OrderDetails = {
      bike,
      startDate: dateRange.from,
      endDate: dateRange.to,
      options: selectedOptions.filter(opt => opt.selected),
      totalPrice,
      numDays: numberOfDays,
    };
    localStorage.setItem('currentOrder', JSON.stringify(orderDetails));
    router.push('/checkout');
  };

  if (!bike) {
    return (
        <div className="text-center py-10">
          <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
          <h1 className="text-2xl font-semibold">Motorbike Not Found</h1>
          <p className="text-muted-foreground">The motorbike you are looking for does not exist or is currently unavailable.</p>
          <Button onClick={() => router.push('/')} className="mt-4">Back to Catalog</Button>
        </div>
    );
  }

  const canRent = bike.isAvailable && numberOfDays > 0 && isAvailableForDates === true;

  return (
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Image and Basic Info */}
        <Card className="shadow-xl">
          <CardHeader className="p-0">
            <div className="aspect-video relative w-full rounded-t-lg overflow-hidden">
              <Image
                src={bike.imageUrl.split('"')[0]} // Handle potential data-ai-hint in URL
                alt={bike.name}
                layout="fill"
                objectFit="cover"
                 {...(bike.imageUrl.includes('data-ai-hint') ? { 'data-ai-hint': bike.imageUrl.split('data-ai-hint="')[1].split('"')[0] } : {})}
              />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold text-primary mb-2">{bike.name}</h1>
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Tag className="w-4 h-4 mr-1.5" /> {bike.type}
            </div>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <MapPinIcon className="w-4 h-4 mr-1.5" /> {bike.location}
            </div>
            {bike.rating && (
              <div className="flex items-center text-amber-400 mb-3">
                {[...Array(Math.floor(bike.rating))].map((_, i) => (
                  <Star key={`full-${i}`} className="w-5 h-5 fill-current" />
                ))}
                {bike.rating % 1 !== 0 && <Star key="half" className="w-5 h-5 fill-current opacity-50" />}
                {[...Array(5 - Math.ceil(bike.rating))].map((_, i) => (
                  <Star key={`empty-${i}`} className="w-5 h-5 text-muted-foreground" />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">({bike.rating.toFixed(1)} rating)</span>
              </div>
            )}
            <p className="text-foreground/80 mb-4">{bike.description}</p>

            <h3 className="font-semibold text-lg mb-2 flex items-center"><Settings className="w-5 h-5 mr-2 text-primary" />Features:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-foreground/70">
              {bike.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
             {!bike.isAvailable && ( // General availability
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Currently Unavailable</AlertTitle>
                <AlertDescription>
                  This motorbike is not available for rent at the moment.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Rental Options */}
        <Card className="shadow-xl sticky top-24">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center"><CalendarDays className="w-6 h-6 mr-2 text-primary" />Rental Options</CardTitle>
            <CardDescription>Select your rental period and additional options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="date-range" className="text-base font-medium mb-2 block">Rental Dates</Label>
              <Calendar
                id="date-range"
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                className="rounded-md border p-0"
                disabled={{ before: new Date() }}
              />
              {dateRange?.from && dateRange?.to && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")} ({numberOfDays} {numberOfDays === 1 ? 'day' : 'days'})
                </p>
              )}
            </div>
            
            {/* Availability Status Alert */}
            {isAvailableForDates !== null && dateRange?.from && dateRange?.to && (
              <Alert variant={isAvailableForDates ? "default" : "destructive"} className="mb-0"> {/* Removed mb-6, use space-y-6 of parent */}
                {isAvailableForDates ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>
                  {isAvailableForDates ? "Bike Availability" : "Bike Not Available"}
                </AlertTitle>
                <AlertDescription>
                  {isAvailableForDates
                    ? "This motorbike is available for your selected dates."
                    : "This motorbike is not available for the selected period. Please choose different dates or another bike."}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h3 className="text-base font-medium mb-3 mt-4">Additional Options</h3> {/* Added mt-4 for spacing */}
              <div className="space-y-3">
                {selectedOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-3 p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <Checkbox
                      id={option.id}
                      checked={option.selected}
                      onCheckedChange={() => handleOptionChange(option.id)}
                      disabled={!bike.isAvailable} // General availability for options
                    />
                    <Label htmlFor={option.id} className="flex-grow text-sm font-normal cursor-pointer">
                      {option.name}
                    </Label>
                    <span className="text-sm text-muted-foreground">+ ${option.price}/day</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="p-6 flex flex-col items-stretch space-y-4">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total Price:</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
             <p className="text-sm text-muted-foreground text-right">
              ${bike.pricePerDay}/day for the bike + options
            </p>
            <Button
              size="lg"
              className="w-full"
              onClick={handleRentNow}
              disabled={!canRent}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {canRent ? 'Rent Now & Proceed to Checkout' : (bike.isAvailable ? 'Check Dates' : 'Unavailable')}
            </Button>
          </CardFooter>
        </Card>
      </div>
  );
}
