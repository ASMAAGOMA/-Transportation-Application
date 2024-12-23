import React from 'react';

const HeroSection = ({ children }) => (
  <section className="relative h-64 sm:h-80 md:h-96 lg:h-[28rem] xl:h-[32rem]">
    {/* Hero Image with responsive height */}
    <img 
      src="/images/first big one_enhanced.jpg"
      alt="Forest path"
      className="w-full h-full object-cover"
    />

    {/* Overlay with responsive text */}
    <div className="absolute inset-0 bg-black/20 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 sm:mb-20 md:mb-24 lg:mb-32 
          drop-shadow-lg leading-tight">
          Discover exclusive trip offers for you
        </h1>
      </div>
    </div>

    {/* Search Component Container with responsive positioning */}
    <div className="absolute -bottom-8 sm:-bottom-10 md:-bottom-12 lg:-bottom-14 left-1/2 transform -translate-x-1/2 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  </section>
);

export default HeroSection;