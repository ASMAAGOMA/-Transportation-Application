// SearchForm.js
import React, { useState } from 'react';

const SearchForm = ({ onSearch }) => {
  const [searchCriteria, setSearchCriteria] = useState({
    origin: '',
    destination: '',
    startDate: '',
    endDate: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = () => {
    onSearch(searchCriteria);
  };

  return (
    <div className="bg-gray-300/95 p-6 md:p-8 rounded-lg w-full md:w-[900px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
        <div className="border-b md:border-r border-gray-400 pb-4 md:pb-0">
          <label className="text-sm text-gray-600 mb-1 block">Explore</label>
          <input 
            type="text" 
            name="origin"
            value={searchCriteria.origin}
            onChange={handleInputChange}
            placeholder="Paris Charles de Gaulle" 
            className="w-full bg-gray-300 text-gray-900 placeholder-gray-900 font-medium text-lg focus:outline-none" 
          />
        </div>
        <div className="border-b md:border-r border-gray-400 pb-4 md:pb-0">
          <label className="text-sm text-gray-600 mb-1 block">To</label>
          <input 
            type="text" 
            name="destination"
            value={searchCriteria.destination}
            onChange={handleInputChange}
            placeholder="Amsterdam Schiphol" 
            className="w-full bg-gray-300 text-gray-900 placeholder-gray-900 font-medium text-lg focus:outline-none" 
          />
        </div>
        <div className="border-b md:border-r border-gray-400 pb-4 md:pb-0">
          <label className="text-sm text-gray-600 mb-1 block">Start</label>
          <input 
            type="date" 
            name="startDate"
            value={searchCriteria.startDate}
            onChange={handleInputChange}
            className="w-full bg-gray-300 text-gray-900 placeholder-gray-900 font-medium text-lg focus:outline-none" 
          />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-full md:w-auto">
            <label className="text-sm text-gray-600 mb-1 block">End</label>
            <input 
              type="date" 
              name="endDate"
              value={searchCriteria.endDate}
              onChange={handleInputChange}
              className="w-full bg-gray-300 text-gray-900 placeholder-gray-900 font-medium text-lg focus:outline-none" 
            />
          </div>
          <button 
            className="bg-red-500 hover:bg-red-600 p-4 rounded-lg transition-colors duration-200 mt-4 md:mt-0 md:ml-4 w-14 h-14 flex items-center justify-center"
            aria-label="Search"
            onClick={handleSearch}
          >
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
