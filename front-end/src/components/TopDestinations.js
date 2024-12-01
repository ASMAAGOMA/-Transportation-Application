import React from 'react';
import DestinationCard from './DestinationCard';

const TopDestinations = () => (
    <section className="px-8 py-12">
      <h2 className="text-2xl font-bold mb-6">Top Destinations</h2>
      <div className="grid grid-cols-4 gap-6">
        <DestinationCard city="Barcelona" price={50} image="/images/top1_enhanced.jpg" />
        <DestinationCard city="Tokyo" price={90} image="/images/top2_enhanced.jpg" />
        <DestinationCard city="Sydney" price={420} image="/images/top3_enhanced.jpg" />
        <DestinationCard city="Dubai" price={200} image="/images/top4_enhanced.jpg" />
      </div>
    </section>
  );
export default TopDestinations;