"use client";

import { useState } from 'react';
import MainLayout from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, MapPin, Search, ListChecks, AlertCircle } from 'lucide-react';
import { getLocationSuggestions, type LocationSuggestionsInput, type LocationSuggestionsOutput } from '@/ai/flows/location-suggestions';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const locationSchema = z.object({
  userLocation: z.string().min(3, { message: "Please enter a more specific location (at least 3 characters)." }),
});

export default function LocationFinderPage() {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      userLocation: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof locationSchema>) => {
    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const input: LocationSuggestionsInput = { userLocation: values.userLocation };
      const result: LocationSuggestionsOutput = await getLocationSuggestions(input);
      if (result && result.suggestions) {
        setSuggestions(result.suggestions);
      } else {
        setError("No suggestions found. The AI might be having trouble with this location.");
      }
    } catch (e) {
      console.error("Error fetching location suggestions:", e);
      setError("Failed to fetch suggestions. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary flex items-center">
              <MapPin className="w-8 h-8 mr-3" /> AI Location Finder
            </CardTitle>
            <CardDescription>
              Enter your current location or desired area, and our AI will suggest nearby motorbike rental spots.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="userLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Your Location</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input 
                            placeholder="e.g., 'Downtown Los Angeles' or 'Near Eiffel Tower'" 
                            {...field}
                            className="flex-grow"
                          />
                        </FormControl>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Search className="h-5 w-5" />
                          )}
                           <span className="sr-only sm:not-sr-only sm:ml-2">Find Locations</span>
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {suggestions.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <ListChecks className="w-5 h-5 mr-2 text-primary" /> Suggested Locations:
                </h3>
                <ul className="space-y-2 list-disc list-inside pl-1 bg-card-foreground/5 p-4 rounded-md">
                  {suggestions.map((suggestion, index) => (
                    <li key={index} className="text-foreground/90 text-sm p-2 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors rounded">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {!isLoading && !error && suggestions.length === 0 && form.formState.isSubmitted && (
                 <Alert className="mt-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>No Suggestions Yet</AlertTitle>
                    <AlertDescription>No suggestions found for the entered location, or the AI couldn't provide specific spots. Try being more general or specific.</AlertDescription>
                </Alert>
            )}

          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
