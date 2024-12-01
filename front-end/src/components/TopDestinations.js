import React from 'react';
import DestinationCard from './DestinationCard';

const TopDestinations = () => (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold mb-6">Top Destinations</h2>
      <div className="grid grid-cols-4 gap-6">
        <DestinationCard city="Barcelona" price={50} image="/api/placeholder/300/300" />
        <DestinationCard city="Tokyo" price={90} image="/api/placeholder/300/300" />
        <DestinationCard city="Sydney" price={420} image="/api/placeholder/300/300" />
        <DestinationCard city="Dubai" price={200} image="/api/placeholder/300/300" />
      </div>
    </section>
  );
export default TopDestinations;