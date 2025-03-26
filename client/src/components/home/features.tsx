export default function Features() {
  return (
    <section className="py-10 md:py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Why Choose Sri Lanka Railways Online
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Book your train tickets conveniently and securely through our online platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-xl text-center">
            <div className="w-14 h-14 mx-auto bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-mobile-alt text-2xl"></i>
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Easy Booking</h3>
            <p className="text-neutral-600">Book tickets anytime, anywhere from your mobile device or computer.</p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-xl text-center">
            <div className="w-14 h-14 mx-auto bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-ticket-alt text-2xl"></i>
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Digital Tickets</h3>
            <p className="text-neutral-600">Skip the queue with digital tickets that can be shown on your mobile device.</p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-xl text-center">
            <div className="w-14 h-14 mx-auto bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-credit-card text-2xl"></i>
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Secure Payments</h3>
            <p className="text-neutral-600">Multiple secure payment options to choose from for your convenience.</p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white p-6 rounded-xl text-center">
            <div className="w-14 h-14 mx-auto bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
              <i className="fas fa-history text-2xl"></i>
            </div>
            <h3 className="font-heading font-bold text-lg mb-2">Real-Time Updates</h3>
            <p className="text-neutral-600">Get real-time updates about your train schedule and any changes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
