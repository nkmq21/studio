
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, startOfDay, addDays } from 'date-fns'; 
import { CalendarCheck, Search, CalendarIcon } from 'lucide-react';

export default function SelectDatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState<Date | undefined>(startOfDay(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(startOfDay(new Date()), 3));

  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  // Effect to ensure endDate is not before startDate if startDate changes
  useEffect(() => {
    if (startDate && endDate && startOfDay(endDate) < startOfDay(startDate)) {
      setEndDate(undefined); 
      toast({
        title: "End Date Adjusted",
        description: "End date cannot be before the start date. Please re-select.",
        variant: "destructive", // Changed variant
      });
    }
  }, [startDate, endDate, toast]);


  const handleFindBikes = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Invalid Date Range",
        description: "Please select both a start and end date for your rental.",
        variant: "destructive",
      });
      return;
    }

    const today = startOfDay(new Date());

    if (startOfDay(startDate) < today) {
      toast({
        title: "Invalid Start Date",
        description: "The start date cannot be in the past.",
        variant: "destructive",
      });
      return;
    }
    
    if (startOfDay(startDate) > startOfDay(endDate)) {
      toast({
        title: "Invalid Date Order",
        description: "The start date cannot be after the end date.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('motoRentSelectedDates', JSON.stringify({
      from: startDate.toISOString(),
      to: endDate.toISOString(),
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
          <CardContent className="flex flex-col items-center space-y-6 px-4 md:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <Label htmlFor="startDatePopover" className="mb-1.5 block text-sm font-medium">Start Date</Label>
                <Popover open={isStartDatePickerOpen} onOpenChange={setIsStartDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="startDatePopover"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        const newStartDate = date ? startOfDay(date) : undefined;
                        setStartDate(newStartDate);
                        if (newStartDate && endDate && startOfDay(newStartDate) > startOfDay(endDate)) {
                           setEndDate(undefined);
                           toast({
                                title: "End Date Cleared",
                                description: "End date was before the new start date and has been cleared.",
                                variant: "destructive", // Changed variant
                            });
                        }
                        setIsStartDatePickerOpen(false);
                      }}
                      disabled={{ before: startOfDay(new Date()) }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="endDatePopover" className="mb-1.5 block text-sm font-medium">End Date</Label>
                <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
                  <PopoverTrigger asChild>
                     <Button
                      id="endDatePopover"
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        const newEndDate = date ? startOfDay(date) : undefined;
                        setEndDate(newEndDate);
                        setIsEndDatePickerOpen(false);
                      }}
                      disabled={{ before: startDate ? startOfDay(startDate) : startOfDay(new Date()) }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            {startDate && endDate && (
              <p className="text-sm text-muted-foreground pt-4">
                Selected Period: {format(startDate, "PPP")} - {format(endDate, "PPP")}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              size="lg"
              className="w-full"
              onClick={handleFindBikes}
              disabled={!startDate || !endDate}
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
