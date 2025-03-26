export default function AppDownload() {
  return (
    <section className="py-10 md:py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
              Download Our Mobile App
            </h2>
            <p className="text-white/80 text-lg mb-6">
              Book tickets, check schedules, and receive real-time updates on your train journey with our mobile app
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="bg-black rounded-lg px-4 py-3 flex items-center hover:bg-neutral-900 transition-colors">
                <i className="fab fa-apple text-2xl text-white mr-3"></i>
                <div>
                  <div className="text-xs text-white/70">Download on the</div>
                  <div className="text-white font-medium">App Store</div>
                </div>
              </a>
              <a href="#" className="bg-black rounded-lg px-4 py-3 flex items-center hover:bg-neutral-900 transition-colors">
                <i className="fab fa-google-play text-2xl text-white mr-3"></i>
                <div>
                  <div className="text-xs text-white/70">GET IT ON</div>
                  <div className="text-white font-medium">Google Play</div>
                </div>
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <img 
              src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Sri Lanka Railways mobile app" 
              className="rounded-xl shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
