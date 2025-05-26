
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid, startOfDay } from 'date-fns';
import { CalendarCheck, Search, CalendarIcon } from 'lucide-react'; // Added CalendarIcon

export default function SelectDatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 3);
    return tomorrow;
  });

  const [startDateInput, setStartDateInput] = useState<string>('');
  const [endDateInput, setEndDateInput] = useState<string>('');

  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);

  // Effect to initialize/update input fields when startDate or endDate changes
  useEffect(() => {
    if (startDate) {
      setStartDateInput(format(startDate, 'yyyy-MM-dd'));
    } else {
      setStartDateInput('');
    }
  }, [startDate]);

  useEffect(() => {
    if (endDate) {
      setEndDateInput(format(endDate, 'yyyy-MM-dd'));
    } else {
      setEndDateInput('');
    }
  }, [endDate]);

  const handleStartDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateString = e.target.value;
    setStartDateInput(newDateString);
    const parsedDate = parse(newDateString, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      setStartDate(parsedDate);
      // If new start date is after end date, clear end date
      if (endDate && parsedDate > endDate) {
        setEndDate(undefined);
      }
    } else if (newDateString === '') {
        setStartDate(undefined);
    }
  };
  
  const handleEndDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateString = e.target.value;
    setEndDateInput(newDateString);
    const parsedDate = parse(newDateString, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      setEndDate(parsedDate);
      // If new end date is before start date, clear start date (or handle as error later)
      if (startDate && parsedDate < startDate) {
        // Or perhaps better: setStartDate(parsedDate) and clear end date for a range selection UX
        // For now, we'll let validation catch this.
      }
    } else if (newDateString === '') {
        setEndDate(undefined);
    }
  };

  const handleFindBikes = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Invalid Date Range",
        description: "Please select or enter both a start and end date for your rental.",
        variant: "destructive",
      });
      return;
    }

    const today = startOfDay(new Date()); // Normalize today to start of day

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
                <Label htmlFor="startDate" className="mb-1.5 block text-sm font-medium">Start Date</Label>
                <Popover open={isStartDatePickerOpen} onOpenChange={setIsStartDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
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
                        setStartDate(date);
                        if (date && endDate && date > endDate) {
                          setEndDate(undefined); // Clear end date if start is after it
                        }
                        setIsStartDatePickerOpen(false);
                      }}
                      disabled={{ before: new Date() }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                 <Input 
                  id="startDateManual" 
                  type="date"
                  value={startDateInput} 
                  onChange={handleStartDateInputChange} 
                  className="mt-2 text-center"
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="mb-1.5 block text-sm font-medium">End Date</Label>
                <Popover open={isEndDatePickerOpen} onOpenChange={setIsEndDatePickerOpen}>
                  <PopoverTrigger asChild>
                     <Button
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
                        setEndDate(date);
                        setIsEndDatePickerOpen(false);
                      }}
                      disabled={{ before: startDate || new Date() }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                 <Input 
                  id="endDateManual" 
                  type="date"
                  value={endDateInput} 
                  onChange={handleEndDateInputChange} 
                  className="mt-2 text-center"
                  min={startDate ? format(startDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
            
            {/* Combined Calendar for visual range selection (optional, or remove if popovers are primary) */}
            {/* For simplicity, the popovers are now the primary way. This Calendar could be removed or adapted. */}
            {/* 
            <Calendar
              mode="range"
              selected={{from: startDate, to: endDate}}
              onSelect={(range) => {
                if (range) {
                  setStartDate(range.from);
                  setEndDate(range.to);
                }
              }}
              numberOfMonths={1}
              className="rounded-md border"
              disabled={{ before: new Date() }}
            />
            */}

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
