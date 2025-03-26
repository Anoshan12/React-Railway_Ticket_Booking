import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/calendar";
import { Loader2, Train, Search } from "lucide-react";
import { Station } from "@shared/schema";

// Form schema
const bookingFormSchema = z.object({
  departureStationId: z.string().min(1, { message: "Please select departure station" }),
  arrivalStationId: z.string().min(1, { message: "Please select arrival station" }),
  departureDate: z.date({ required_error: "Please select a date" }),
  ticketClass: z.string().min(1, { message: "Please select ticket class" }),
  passengers: z.string().min(1).max(10).transform(Number),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const BookingForm = () => {
  const [, navigate] = useLocation();
  const [passengers, setPassengers] = useState(1);

  // Fetch stations
  const { data: stations, isLoading: isLoadingStations } = useQuery<Station[]>({
    queryKey: ["/api/stations"],
  });

  // Initialize form
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      departureStationId: "",
      arrivalStationId: "",
      departureDate: new Date(),
      ticketClass: "second",
      passengers: "1",
    },
  });

  // Handle form submission
  const onSubmit = (values: BookingFormValues) => {
    // Navigate to train selection page with search parameters
    navigate(`/trains?from=${values.departureStationId}&to=${values.arrivalStationId}&date=${values.departureDate.toISOString()}&class=${values.ticketClass}&passengers=${values.passengers}`);
  };

  // Handle passenger count increment/decrement
  const incrementPassengers = () => {
    if (passengers < 10) {
      setPassengers(passengers + 1);
      form.setValue("passengers", String(passengers + 1));
    }
  };

  const decrementPassengers = () => {
    if (passengers > 1) {
      setPassengers(passengers - 1);
      form.setValue("passengers", String(passengers - 1));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <FormField
            control={form.control}
            name="departureStationId"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>From</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select departure station" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingStations ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                      </div>
                    ) : (
                      stations?.map((station) => (
                        <SelectItem key={station.id} value={String(station.id)}>
                          {station.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="arrivalStationId"
            render={({ field }) => (
              <FormItem className="sm:col-span-3">
                <FormLabel>To</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select arrival station" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoadingStations ? (
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                      </div>
                    ) : (
                      stations?.map((station) => (
                        <SelectItem key={station.id} value={String(station.id)}>
                          {station.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="departureDate"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Date</FormLabel>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  className="w-full"
                  minDate={new Date()}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ticketClass"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="first">First Class</SelectItem>
                    <SelectItem value="second">Second Class</SelectItem>
                    <SelectItem value="third">Third Class</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passengers"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Passengers</FormLabel>
                <div className="flex rounded-md shadow-sm">
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-l-md border border-r-0 px-4 py-2"
                    onClick={decrementPassengers}
                  >
                    -
                  </Button>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min="1"
                      max="10"
                      className="text-center rounded-none"
                      onChange={(e) => {
                        field.onChange(e);
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= 10) {
                          setPassengers(val);
                        }
                      }}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-r-md border border-l-0 px-4 py-2"
                    onClick={incrementPassengers}
                  >
                    +
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-center">
          <Button type="submit" className="px-6 py-3 bg-secondary hover:bg-secondary-dark text-white">
            <Search className="mr-2 h-5 w-5" /> Search Trains
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BookingForm;
