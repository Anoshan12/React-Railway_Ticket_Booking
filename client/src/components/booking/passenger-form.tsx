import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight } from "lucide-react";

type PassengerFormProps = {
  trainDetails: any;
  passengerCount: number;
  selectedClass: string;
  departureDate: string;
  onSubmit: (data: any) => void;
};

// Create dynamic schema based on passenger count
const createPassengerFormSchema = (passengerCount: number) => {
  const passengerSchema = z.object({
    firstName: z.string().min(2, { message: "First name is required" }),
    lastName: z.string().min(2, { message: "Last name is required" }),
    idNumber: z.string().min(5, { message: "NIC/Passport number is required" }),
    gender: z.string().min(1, { message: "Gender is required" }),
  });

  const passengersSchema: any = {};
  for (let i = 0; i < passengerCount; i++) {
    passengersSchema[`passenger${i}`] = passengerSchema;
  }

  return z.object({
    ...passengersSchema,
    email: z.string().email({ message: "Please enter a valid email" }),
    phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  });
};

const PassengerForm = ({ 
  trainDetails, 
  passengerCount, 
  selectedClass, 
  departureDate,
  onSubmit 
}: PassengerFormProps) => {
  const [, navigate] = useLocation();
  const passengerFormSchema = createPassengerFormSchema(passengerCount);
  type PassengerFormValues = z.infer<typeof passengerFormSchema>;

  // Generate default values for the form
  const generateDefaultValues = () => {
    const defaultValues: any = { email: "", phone: "" };
    for (let i = 0; i < passengerCount; i++) {
      defaultValues[`passenger${i}`] = {
        firstName: "",
        lastName: "",
        idNumber: "",
        gender: "",
      };
    }
    return defaultValues;
  };

  const form = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: generateDefaultValues(),
  });

  const handleFormSubmit = (values: PassengerFormValues) => {
    // Format data for API
    const passengers = [];
    for (let i = 0; i < passengerCount; i++) {
      passengers.push(values[`passenger${i}`]);
    }

    const formattedData = {
      contactInfo: {
        email: values.email,
        phone: values.phone,
      },
      passengers,
    };

    onSubmit(formattedData);
  };

  const handleGoBack = () => {
    navigate("/trains");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        {/* Passenger information */}
        {Array.from({ length: passengerCount }).map((_, index) => (
          <div key={index} className="px-4 py-5 bg-white sm:p-6 border-b">
            <h4 className="text-md font-medium text-primary mb-4">Passenger {index + 1}</h4>
            <div className="grid grid-cols-6 gap-6">
              <FormField
                control={form.control}
                name={`passenger${index}.firstName`}
                render={({ field }) => (
                  <FormItem className="col-span-6 sm:col-span-3">
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="First name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`passenger${index}.lastName`}
                render={({ field }) => (
                  <FormItem className="col-span-6 sm:col-span-3">
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`passenger${index}.idNumber`}
                render={({ field }) => (
                  <FormItem className="col-span-6 sm:col-span-3">
                    <FormLabel>NIC / Passport Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter ID number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`passenger${index}.gender`}
                render={({ field }) => (
                  <FormItem className="col-span-6 sm:col-span-3">
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}

        {/* Contact Information */}
        <div className="px-4 py-5 bg-white sm:p-6 border-t">
          <h4 className="text-md font-medium text-primary mb-4">Contact Information</h4>
          <div className="grid grid-cols-6 gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-6 sm:col-span-3">
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="your@email.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-6 sm:col-span-3">
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" placeholder="+94 XXXXXXXXX" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleGoBack}
            className="inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            type="submit"
            className="inline-flex items-center bg-secondary hover:bg-secondary-dark"
          >
            Proceed to Payment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PassengerForm;
