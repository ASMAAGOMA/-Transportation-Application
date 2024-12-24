import React from 'react';

const HeroSection = ({ children }) => (
  <section className="relative h-96 sm:h-[400px] md:h-[500px] lg:h-[600px]">
    <img 
      src="/images/first big one_enhanced.jpg"
      alt="Forest path"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 sm:mb-24 md:mb-32 text-center px-4">
        Discover exclusive trip offers for you
      </h1>
    </div>
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
      {children}
    </div>
  </section>
);

export default HeroSection;
