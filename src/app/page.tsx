
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { CalendarCheck, Search } from 'lucide-react';

export default function SelectDatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });

  const handleFindBikes = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Invalid Date Range",
        description: "Please select both a start and end date for your rental.",
        variant: "destructive",
      });
      return;
    }

    if (dateRange.from > dateRange.to) {
      toast({
        title: "Invalid Date Order",
        description: "The start date cannot be after the end date.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('motoRentSelectedDates', JSON.stringify({
      from: dateRange.from.toISOString(),
      to: dateRange.to.toISOString(),
    }));
    router.push('/bikes');
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12">
        <Card className="w-full max-w-lg shadow-xl">
          <CardHeader className="text-center">
            <CalendarCheck className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle className="text-3xl font-bold">Welcome to MotoRent!</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Select your rental dates to find available motorbikes.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1} // Show one month, can be 2 for wider screens if desired
              className="rounded-md border"
              disabled={{ before: new Date() }}
            />
            {dateRange?.from && dateRange?.to && (
              <p className="text-sm text-muted-foreground">
                Selected: {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              onClick={handleFindBikes}
              disabled={!dateRange?.from || !dateRange?.to}
            >
              <Search className="w-5 h-5 mr-2" />
              Find Bikes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
}
