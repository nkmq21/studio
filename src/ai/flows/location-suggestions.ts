// Location Suggestions Flow
'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing location suggestions
 *  based on user input to find nearby motorbike rental locations.
 *
 * - `getLocationSuggestions`:  A function that takes a user's location input
 *    and returns a list of suggested rental locations.
 * - `LocationSuggestionsInput`: The input type for the `getLocationSuggestions` function.
 * - `LocationSuggestionsOutput`: The output type for the `getLocationSuggestions` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const LocationSuggestionsInputSchema = z.object({
  userLocation: z
    .string()
    .describe('The location provided by the user to search for rentals near.'),
});
export type LocationSuggestionsInput = z.infer<typeof LocationSuggestionsInputSchema>;

// Define the output schema
const LocationSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of suggested nearby rental locations.'),
});
export type LocationSuggestionsOutput = z.infer<typeof LocationSuggestionsOutputSchema>;

// Define the main function
export async function getLocationSuggestions(
  input: LocationSuggestionsInput
): Promise<LocationSuggestionsOutput> {
  return locationSuggestionsFlow(input);
}

// Define the prompt
const locationSuggestionsPrompt = ai.definePrompt({
  name: 'locationSuggestionsPrompt',
  input: {schema: LocationSuggestionsInputSchema},
  output: {schema: LocationSuggestionsOutputSchema},
  prompt: `You are a helpful assistant that suggests motorbike rental locations near a given location.

  User Location: {{{userLocation}}}

  Provide a list of suggestions for nearby rental locations.
  Format your response as a JSON array of strings.`,
});

// Define the flow
const locationSuggestionsFlow = ai.defineFlow(
  {
    name: 'locationSuggestionsFlow',
    inputSchema: LocationSuggestionsInputSchema,
    outputSchema: LocationSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await locationSuggestionsPrompt(input);
    return output!;
  }
);
