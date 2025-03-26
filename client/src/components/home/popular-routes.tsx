export default function PopularRoutes() {
  return (
    <section className="py-10 md:py-16 bg-gray-300">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Popular Train Routes in Sri Lanka
          </h2>
          <p className="text-neutral-600 max-w-3xl mx-auto">
            Discover the most scenic and popular train journeys across the island
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Route 1 */}
          <div className="group relative rounded-xl overflow-hidden shadow-md h-80">
            <img 
              src="/images/kandy.jpg"
              alt="Colombo to Kandy train route" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 flex flex-col justify-end">
              <h3 className="font-heading text-xl font-bold text-white mb-1">Colombo to Kandy</h3>
              <p className="text-neutral-200 mb-3">Journey through the central highlands</p>
              <div className="flex justify-between items-center">
                <span className="text-white">
                  <i className="fas fa-clock mr-1"></i> 2h 30m
                </span>
                <a href="#" className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded backdrop-blur-sm transition-colors">
                  View Details
                </a>
              </div>
            </div>
          </div>
          
          {/* Route 2 */}
          <div className="group relative rounded-xl overflow-hidden shadow-md h-80">
            <img 
              src="/images/jaffna.jpg" 
              alt="Kandy to Ella train route" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 flex flex-col justify-end">
              <h3 className="font-heading text-xl font-bold text-white mb-1">Kandy to Jaffna</h3>
              <p className="text-neutral-200 mb-3">Sri Lanka's most scenic train journey</p>
              <div className="flex justify-between items-center">
                <span className="text-white">
                  <i className="fas fa-clock mr-1"></i> 7h 00m
                </span>
                <a href="#" className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded backdrop-blur-sm transition-colors">
                  View Details
                </a>
              </div>
            </div>
          </div>
          
          {/* Route 3 */}
          <div className="group relative rounded-xl overflow-hidden shadow-md h-80">
            <img 
              src="/images/galle.jpg" 
              alt="Colombo to Galle train route" 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-6 flex flex-col justify-end">
              <h3 className="font-heading text-xl font-bold text-white mb-1">Colombo to Galle</h3>
              <p className="text-neutral-200 mb-3">Coastal line with ocean views</p>
              <div className="flex justify-between items-center">
                <span className="text-white">
                  <i className="fas fa-clock mr-1"></i> 2h 15m
                </span>
                <a href="#" className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1 rounded backdrop-blur-sm transition-colors">
                  View Details
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
