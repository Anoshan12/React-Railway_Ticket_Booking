import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import BookingForm from "@/components/home/booking-form";
import Schedules from "@/components/home/schedules";
import Features from "@/components/home/features";
import PopularRoutes from "@/components/home/popular-routes";
import AppDownload from "@/components/home/app-download";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <BookingForm />
        <Schedules />
        <Features />
        <PopularRoutes />
        <AppDownload />
      </main>
      <Footer />
    </div>
  );
}
