import React from 'react';
import SearchField from './SearchField';

const SearchForm = () => (
    <div className="bg-white rounded-lg shadow-lg p-4 flex gap-8 items-center">
      <SearchField label="Explore" value="Paris Charles de Gaulle" />
      <SearchField label="To" value="Amsterdam Schiphol" />
      <SearchField label="Start" value="12/09/2023" />
      <SearchField label="End" value="22/09/2023" />
      <button className="bg-red-500 p-2 rounded-lg">
        <span className="text-white">▶</span>
      </button>
    </div>
  );
  
export default SearchForm;