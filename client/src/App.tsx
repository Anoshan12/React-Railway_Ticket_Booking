import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute, AdminRoute } from "./lib/protected-route";

// Pages
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import BookingPage from "@/pages/booking-page";
import PaymentPage from "@/pages/payment-page";
import ConfirmationPage from "@/pages/confirmation-page";
import ProfilePage from "@/pages/profile-page";
import NotFound from "@/pages/not-found";

// Admin Pages
import AdminDashboard from "@/pages/admin/dashboard";
import AdminTrains from "@/pages/admin/trains";
import AdminBookings from "@/pages/admin/bookings";
import AdminUsers from "@/pages/admin/users";
import AdminReports from "@/pages/admin/reports";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <AdminRoute path="/admin" component=
      {AdminDashboard} />

      {/* Protected user routes */}
      <ProtectedRoute path="/booking" component={BookingPage} />
      <ProtectedRoute path="/payment/:bookingId" component={PaymentPage} />
      <ProtectedRoute path="/confirmation/:bookingId" component={ConfirmationPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />

      <AdminRoute path="/admin/trains" component={AdminTrains} />
      <AdminRoute path="/admin/bookings" component={AdminBookings} />
      <AdminRoute path="/admin/users" component={AdminUsers} />
      <AdminRoute path="/admin/reports" component={AdminReports} />
      <Route component={NotFound} />
    </Switch>
  );
}
      
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
