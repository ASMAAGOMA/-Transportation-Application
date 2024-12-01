// HeroSection.js
import React from 'react';
import SearchForm from './SearchForm';

const HeroSection = () => (
    <section className="relative h-96 mb-12">
      <img 
        src="/images/first big one_enhanced.jpg"
        alt="Forest path"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-white">Discover exclusive trip offers for you</h1>
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
        <SearchForm />
      </div>
    </section>
  );

export default HeroSection;