
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
import type { DateRange } from 'react-day-picker';
import { addDays, format, parse, isValid } from 'date-fns';
import { CalendarCheck, Search } from 'lucide-react';

export default function SelectDatesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 3),
  });
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');

  // Effect to update input fields when dateRange (from calendar or initial load) changes
  useEffect(() => {
    if (dateRange?.from) {
      setStartDateInput(format(dateRange.from, 'yyyy-MM-dd'));
    } else {
      setStartDateInput('');
    }
    if (dateRange?.to) {
      setEndDateInput(format(dateRange.to, 'yyyy-MM-dd'));
    } else {
      setEndDateInput('');
    }
  }, [dateRange]);

  const handleStartDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateString = e.target.value;
    setStartDateInput(newDateString);
    const parsedDate = parse(newDateString, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      // Keep existing 'to' date if 'from' is changed, or clear 'to' if 'from' becomes after 'to'
      setDateRange(prev => {
        const newFrom = parsedDate;
        const currentTo = prev?.to;
        if (currentTo && newFrom > currentTo) {
          return { from: newFrom, to: undefined };
        }
        return { ...prev, from: newFrom };
      });
    } else if (newDateString === '') {
        setDateRange(prev => ({ ...prev, from: undefined }));
    }
  };
  
  const handleEndDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDateString = e.target.value;
    setEndDateInput(newDateString);
    const parsedDate = parse(newDateString, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      // Keep existing 'from' date if 'to' is changed
      setDateRange(prev => ({ ...prev, to: parsedDate }));
    } else if (newDateString === '') {
        setDateRange(prev => ({ ...prev, to: undefined }));
    }
  };


  const handleFindBikes = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Invalid Date Range",
        description: "Please select or enter both a start and end date for your rental.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    if (dateRange.from < today) {
      toast({
        title: "Invalid Start Date",
        description: "The start date cannot be in the past.",
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full px-4 sm:px-0">
              <div>
                <Label htmlFor="startDate" className="mb-1.5 block text-sm font-medium">Start Date</Label>
                <Input 
                  id="startDate" 
                  value={startDateInput} 
                  onChange={handleStartDateInputChange} 
                  placeholder="YYYY-MM-DD" 
                  className="text-center"
                />
              </div>
              <div>
                <Label htmlFor="endDate" className="mb-1.5 block text-sm font-medium">End Date</Label>
                <Input 
                  id="endDate" 
                  value={endDateInput} 
                  onChange={handleEndDateInputChange} 
                  placeholder="YYYY-MM-DD" 
                  className="text-center"
                />
              </div>
            </div>
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
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
