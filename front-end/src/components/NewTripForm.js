import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import { useAddNewTripMutation } from '../features/trips/tripsApiSlice';
import { PlusCircle, X } from 'lucide-react';

const NewTripForm = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const user = useSelector(selectCurrentUser);
  const [addNewTrip] = useAddNewTripMutation();

  const adminEmails = ['asmaagadallaah@gmail.com', 'asmaaGad@gmail.com', 'abrargomaa111@gmail.com', 'ahmed@gmail.com'];
  const isAdmin = user && adminEmails.includes(user.email);

  const [newTrip, setNewTrip] = useState({
    destination: '',
    origin: '',
    price: '',
    startDate: '',
    duration: '',
    image: null,
    description: '',
    maxPassengers: 4
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTrip(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setNewTrip(prev => ({
      ...prev,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    const startDateTime = new Date(newTrip.startDate);
    const endDateTime = new Date(startDateTime.getTime() + (parseFloat(newTrip.duration) * 60 * 60 * 1000));
    
    formData.append('destination', newTrip.destination);
    formData.append('origin', newTrip.origin);
    formData.append('price', newTrip.price);
    formData.append('startDate', startDateTime.toISOString());
    formData.append('endDate', endDateTime.toISOString());
    formData.append('duration', newTrip.duration);
    formData.append('description', newTrip.description || '');
    formData.append('maxPassengers', newTrip.maxPassengers);
    formData.append('status', 'available');
    
    if (newTrip.image) {
      formData.append('image', newTrip.image);
    }

    try {
      await addNewTrip(formData).unwrap();
      setNewTrip({
        destination: '',
        origin: '',
        price: '',
        startDate: '',
        duration: '',
        image: null,
        description: '',
        maxPassengers: 4
      });
      setIsFormVisible(false);
    } catch (err) {
      console.error('Failed to create trip:', err);
      alert(`Failed to create trip: ${err.data?.message || 'Unknown error'}`);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="mb-8">
      {!isFormVisible ? (
        <button
          onClick={() => setIsFormVisible(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Trip
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Create New Trip</h2>
            <button
              onClick={() => setIsFormVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                <input
                  type="text"
                  name="destination"
                  value={newTrip.destination}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                <input
                  type="text"
                  name="origin"
                  value={newTrip.origin}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newTrip.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                <input
                  type="number"
                  name="duration"
                  value={newTrip.duration}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="startDate"
                  value={newTrip.startDate}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newTrip.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Passengers</label>
                <input
                  type="number"
                  name="maxPassengers"
                  value={newTrip.maxPassengers}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
                  accept="image/*"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsFormVisible(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Create Trip
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default NewTripForm;
