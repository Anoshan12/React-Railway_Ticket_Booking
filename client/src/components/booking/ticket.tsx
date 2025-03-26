import { formatCurrency, formatDate, getClassLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Train, Printer, Download, Circle } from "lucide-react";

type TicketProps = {
  booking: any;
};

const Ticket = ({ booking }: TicketProps) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real application, this would generate a PDF using a library like jsPDF
    alert("This would download the ticket as a PDF in a real application.");
  };

  return (
    <Card className="shadow-lg">
      <div className="px-4 py-5 sm:px-6 bg-primary flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-white">Ticket Details</h3>
        <div>
          <span className="inline-flex rounded-md shadow-sm mr-2">
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="inline-flex items-center"
            >
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
          </span>
          <span className="inline-flex rounded-md shadow-sm">
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="inline-flex items-center"
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </span>
        </div>
      </div>
      <CardContent className="p-0">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
            <div>
              <div className="text-xs text-gray-500">Ticket Number</div>
              <div className="text-lg font-bold text-primary">#{booking.ticketNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Booking Date</div>
              <div className="text-sm text-gray-900">{formatDate(booking.bookingDate)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Train Information</h4>
              <div className="mt-2">
                <div className="text-lg font-semibold text-primary">{booking.train.name}</div>
                <div className="text-sm text-gray-600">Train #{booking.train.trainNumber}</div>
                <div className="text-sm text-gray-900 mt-1">{getClassLabel(booking.ticketClass)}</div>
                <div className="text-sm text-gray-600">
                  Seats: {Array.from({ length: booking.totalPassengers }).map((_, i) => (
                    <span key={i}>{booking.train.trainNumber.slice(-2)}
                      {String.fromCharCode(65 + Math.floor(i / 4))}{i % 4 + 1}{i < booking.totalPassengers - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Journey Details</h4>
              <div className="mt-2">
                <div className="flex items-start">
                  <Circle className="h-3 w-3 text-secondary mt-1.5 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.train.departureStationName}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(booking.travelDate)} | {booking.train.departureTime}
                    </div>
                  </div>
                </div>
                <div className="ml-1.5 my-1 border-l-2 border-gray-200 h-6"></div>
                <div className="flex items-start">
                  <Circle className="h-3 w-3 text-secondary mt-1.5 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{booking.train.arrivalStationName}</div>
                    <div className="text-sm text-gray-600">
                      {formatDate(booking.travelDate)} | {booking.train.arrivalTime}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Passenger Information</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {booking.passengers.map((passenger: any, index: number) => (
                  <div key={passenger.id} className="md:col-span-1 grid grid-cols-2">
                    <div>
                      <span className="text-xs text-gray-500">Passenger {index + 1}</span>
                      <div className="text-sm text-gray-900">{passenger.firstName} {passenger.lastName}</div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">NIC/Passport</span>
                      <div className="text-sm text-gray-900">{passenger.idNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="md:col-span-1">
                  <span className="text-xs text-gray-500">Payment Method</span>
                  <div className="text-sm text-gray-900">
                    {booking.paymentMethod === 'card'
                      ? 'Credit Card (••••1234)'
                      : booking.paymentMethod === 'mobile'
                      ? 'Mobile Payment'
                      : 'PayPal'}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <span className="text-xs text-gray-500">Amount Paid</span>
                  <div className="text-sm font-medium text-secondary">{formatCurrency(booking.totalPrice + 50)}</div>
                </div>
                <div className="md:col-span-1">
                  <span className="text-xs text-gray-500">Transaction ID</span>
                  <div className="text-sm text-gray-900">{booking.transactionId || 'TXN' + Math.floor(Math.random() * 1000000)}</div>
                </div>
                <div className="md:col-span-1">
                  <span className="text-xs text-gray-500">Payment Date</span>
                  <div className="text-sm text-gray-900">{formatDate(booking.bookingDate)}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-500">
              <p>Important Notes:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Please arrive at the station at least 30 minutes before departure.</li>
                <li>Keep this ticket and a valid ID with you during the journey.</li>
                <li>For cancellations, please contact us at least 24 hours before departure.</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Ticket;
