import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CreditCard, Smartphone, ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

type PaymentFormProps = {
  bookingData: {
    train: any;
    ticketClass: string;
    totalPassengers: number;
    totalPrice: number;
    departureDate: string;
  };
  passengerData: any;
  onSubmit: (paymentData: any) => void;
};

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["card", "mobile", "paypal"]),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, { message: "Card number must be 16 digits" })
    .optional()
    .or(z.literal("")),
  cardName: z.string().min(3, { message: "Name is required" }).optional().or(z.literal("")),
  expirationDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "Format must be MM/YY" })
    .optional()
    .or(z.literal("")),
  cvc: z
    .string()
    .regex(/^\d{3,4}$/, { message: "CVC must be 3 or 4 digits" })
    .optional()
    .or(z.literal("")),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

const PaymentForm = ({ bookingData, passengerData, onSubmit }: PaymentFormProps) => {
  const [, navigate] = useLocation();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");

  // Booking fee
  const bookingFee = 50; // Rs. 50 per booking
  const totalAmount = bookingData.totalPrice + bookingFee;

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "card",
      cardNumber: "",
      cardName: "",
      expirationDate: "",
      cvc: "",
    },
  });

  const handleFormSubmit = (values: PaymentFormValues) => {
    // Format payment data and submit
    const paymentData = {
      paymentMethod: values.paymentMethod,
      paymentDetails: 
        values.paymentMethod === "card" 
          ? {
              cardNumber: values.cardNumber,
              cardName: values.cardName,
              expirationDate: values.expirationDate,
              cvc: values.cvc,
            }
          : {},
      totalAmount,
    };

    onSubmit(paymentData);
  };

  const handleGoBack = () => {
    navigate("/passenger-details");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-primary">Payment Method</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Select your preferred payment method</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-4">
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedPaymentMethod(value);
                      }}
                      defaultValue={field.value}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="payment-card" />
                        <FormLabel htmlFor="payment-card" className="flex items-center cursor-pointer">
                          <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
                          Credit / Debit Card
                        </FormLabel>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mobile" id="payment-mobile" />
                        <FormLabel htmlFor="payment-mobile" className="flex items-center cursor-pointer">
                          <Smartphone className="h-5 w-5 mr-2 text-gray-500" />
                          Mobile Payment
                        </FormLabel>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="payment-paypal" />
                        <FormLabel htmlFor="payment-paypal" className="flex items-center cursor-pointer">
                          <ShoppingBag className="h-5 w-5 mr-2 text-gray-500" />
                          PayPal
                        </FormLabel>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPaymentMethod === "card" && (
              <div className="mt-6 bg-gray-50 p-4 rounded-md space-y-4">
                <div className="grid grid-cols-6 gap-6">
                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>Card number</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="1234 5678 9012 3456"
                              className="pr-10"
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardName"
                    render={({ field }) => (
                      <FormItem className="col-span-6">
                        <FormLabel>Name on card</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Name as appears on card" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Expiration date (MM/YY)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="MM/YY" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cvc"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="123" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
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
            Complete Payment <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PaymentForm;
