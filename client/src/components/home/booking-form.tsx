import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Station, bookingFormSchema } from "@shared/schema";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingForm() {
  const [, navigate] = useLocation();
  const [tripType, setTripType] = useState<"oneway" | "roundtrip">("oneway");
  
  // Form validation schema
  const { control, handleSubmit, formState: { errors }, watch } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      departureStationId: 0,
      arrivalStationId: 0,
      journeyDate: new Date(),
      ticketClass: 2,
      passengers: 1
    }
  });
  
  // Watch departure station to filter arrival stations
  const departureStationId = watch("departureStationId");
  
  // Fetch all stations
  const { data: stations, isLoading } = useQuery<Station[]>({
    queryKey: ['/api/stations'],
  });
  
  // Filter available arrival stations based on selected departure
  const availableArrivalStations = stations?.filter(station => 
    station.id !== departureStationId
  ) || [];
  
  // Handle form submission
  const onSubmit = (data: BookingFormValues) => {
    // Navigate to booking page with form data
    navigate(`/booking?from=${data.departureStationId}&to=${data.arrivalStationId}&date=${data.journeyDate.toISOString()}&class=${data.ticketClass}&passengers=${data.passengers}`);
  };
  
  return (
    <section id="booking" className="py-10 md:py-16 bg-gray-300">
      <div className="container mx-auto px-4 ">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-2 ">
              Book Your Train Ticket
            </h2>
            <p className="text-neutral-600">
              Find and book your perfect train journey across Sri Lanka
            </p>
          </div>
          
          <div className="bg-neutral-100 rounded-xl p-6 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Tabs */}
              <div className="flex border-b border-neutral-300 mb-6">
                <button 
                  type="button" 
                  className={`px-4 py-2 font-medium ${tripType === "oneway" ? "text-primary border-b-2 border-primary" : "text-neutral-600 hover:text-primary transition-colors"}`}
                  onClick={() => setTripType("oneway")}
                >
                  One Way
                </button>
                <button 
                  type="button" 
                  className={`px-4 py-2 font-medium ${tripType === "roundtrip" ? "text-primary border-b-2 border-primary" : "text-neutral-600 hover:text-primary transition-colors"}`}
                  onClick={() => setTripType("roundtrip")}
                >
                  Round Trip
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {/* From Station */}
                <div>
                  <Label htmlFor="from-station" className="block text-sm font-medium text-neutral-700 mb-1">From</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-map-marker-alt text-neutral-400"></i>
                    </div>
                    <Controller 
                      name="departureStationId"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value ? field.value.toString() : ""}
                        >
                          <SelectTrigger className="pl-10 pr-10 py-3 h-auto border border-neutral-300 rounded-md">
                            <SelectValue placeholder="Select departure station" />
                          </SelectTrigger>
                          <SelectContent>
                            {stations?.map((station) => (
                              <SelectItem key={station.id} value={station.id.toString()}>
                                {station.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.departureStationId && (
                    <p className="text-sm text-destructive mt-1">Please select a departure station</p>
                  )}
                </div>
                
                {/* To Station */}
                <div>
                  <Label htmlFor="to-station" className="block text-sm font-medium text-neutral-700 mb-1">To</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-map-marker-alt text-neutral-400"></i>
                    </div>
                    <Controller 
                      name="arrivalStationId"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value ? field.value.toString() : ""}
                          disabled={!departureStationId}
                        >
                          <SelectTrigger className="pl-10 pr-10 py-3 h-auto border border-neutral-300 rounded-md">
                            <SelectValue placeholder="Select arrival station" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableArrivalStations.map((station) => (
                              <SelectItem key={station.id} value={station.id.toString()}>
                                {station.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.arrivalStationId && (
                    <p className="text-sm text-destructive mt-1">Please select an arrival station</p>
                  )}
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {/* Date */}
                <div>
                  <Label htmlFor="journey-date" className="block text-sm font-medium text-neutral-700 mb-1">Date</Label>
                  <Controller
                    control={control}
                    name="journeyDate"
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-10 pr-3 py-3 h-auto border border-neutral-300 rounded-md justify-start text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <i className="fas fa-calendar text-neutral-400"></i>
                            </div>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => field.onChange(date)}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                </div>
                
                {/* Class */}
                <div>
                  <Label htmlFor="class" className="block text-sm font-medium text-neutral-700 mb-1">Class</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-ticket-alt text-neutral-400"></i>
                    </div>
                    <Controller 
                      name="ticketClass"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value.toString()}
                        >
                          <SelectTrigger className="pl-10 pr-10 py-3 h-auto border border-neutral-300 rounded-md">
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1st Class</SelectItem>
                            <SelectItem value="2">2nd Class</SelectItem>
                            <SelectItem value="3">3rd Class</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                
                {/* Passengers */}
                <div>
                  <Label htmlFor="passengers" className="block text-sm font-medium text-neutral-700 mb-1">Passengers</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-users text-neutral-400"></i>
                    </div>
                    <Controller 
                      name="passengers"
                      control={control}
                      render={({ field }) => (
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value.toString()}
                        >
                          <SelectTrigger className="pl-10 pr-10 py-3 h-auto border border-neutral-300 rounded-md">
                            <SelectValue placeholder="Select passengers" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Passenger</SelectItem>
                            <SelectItem value="2">2 Passengers</SelectItem>
                            <SelectItem value="3">3 Passengers</SelectItem>
                            <SelectItem value="4">4 Passengers</SelectItem>
                            <SelectItem value="5">5 Passengers</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.passengers && (
                    <p className="text-sm text-destructive mt-1">{errors.passengers.message}</p>
                  )}
                </div>
              </div>
              
              <div className="text-center">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-6 h-auto">
                  <i className="fas fa-search mr-2"></i> Search Trains
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
