import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [sports, setSports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [newSport, setNewSport] = useState({ name: '', description: '' });
  const [newLocation, setNewLocation] = useState({ city: '', area: '' });
  const [editingSport, setEditingSport] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('adminToken');

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    fetchSports();
    fetchLocations();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/sports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSports(response.data);
    } catch (err) {
      setError('Failed to fetch sports categories');
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${baseURL}/admin/locations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(response.data);
    } catch (err) {
      setError('Failed to fetch locations');
    }
  };

  const handleChangeSport = (e) => {
    setNewSport({ ...newSport, [e.target.name]: e.target.value });
  };

  const handleChangeLocation = (e) => {
    setNewLocation({ ...newLocation, [e.target.name]: e.target.value });
  };

  const handleCreateOrUpdateSport = async (e) => {
    e.preventDefault();

    try {
      if (editingSport) {
        // Update sport
        await axios.put(`${baseURL}/admin/sports/${editingSport._id}`, newSport, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSports(sports.map((sport) => (sport._id === editingSport._id ? newSport : sport)));
      } else {
        // Create new sport
        const response = await axios.post(`${baseURL}/admin/sports`, newSport, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSports([...sports, response.data]);
      }
      setNewSport({ name: '', description: '' });
      setEditingSport(null);
    } catch (err) {
      setError('Failed to save sport category');
    }
  };

  const handleCreateOrUpdateLocation = async (e) => {
    e.preventDefault();

    try {
      if (editingLocation) {
        // Update location
        await axios.put(`${baseURL}/admin/locations/${editingLocation._id}`, newLocation, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations(locations.map((location) => (location._id === editingLocation._id ? newLocation : location)));
      } else {
        // Create new location
        const response = await axios.post(`${baseURL}/admin/locations`, newLocation, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLocations([...locations, response.data]);
      }
      setNewLocation({ city: '', area: '' });
      setEditingLocation(null);
    } catch (err) {
      setError('Failed to save location');
    }
  };

  const handleEditSport = (sport) => {
    setEditingSport(sport);
    setNewSport({ name: sport.name, description: sport.description });
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setNewLocation({ city: location.city, area: location.area });
  };

  const handleDeleteSport = async (sportId) => {
    try {
      await axios.delete(`${baseURL}/admin/sports/${sportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSports(sports.filter((sport) => sport._id !== sportId));
    } catch (err) {
      setError('Failed to delete sport category');
    }
  };

  const handleDeleteLocation = async (locationId) => {
    try {
      await axios.delete(`${baseURL}/admin/locations/${locationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocations(locations.filter((location) => location._id !== locationId));
    } catch (err) {
      setError('Failed to delete location');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="flex justify-between mb-8">
  {/* Sports Management */}
  <div className="w-1/2 pr-4">
    <h2 className="text-xl mb-4"><u>Manage Sports Categories</u></h2>
    <form onSubmit={handleCreateOrUpdateSport}>
      <div className="mb-4">
        <label className="block text-gray-700">Sport Name</label>
        <input
          type="text"
          name="name"
          value={newSport.name}
          onChange={handleChangeSport}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <input
          type="text"
          name="description"
          value={newSport.description}
          onChange={handleChangeSport}
          className="border rounded p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {editingSport ? 'Update Sport' : 'Create Sport'}
      </button>
    </form>

    {/* Display Sports */}
    {sports.length > 0 ? (
      <ul className="mt-4">
        {sports.map((sport) => (
          <li key={sport._id} className="border rounded p-4 mb-2 flex justify-between">
            <div>
              <h3 className="text-lg font-bold">{sport.name}</h3>
              <p>{sport.description}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditSport(sport)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteSport(sport._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No sports categories found.</p>
    )}
  </div>

  {/* Location Management */}
  <div className="w-1/2 pl-4">
    <h2 className="text-xl mb-4"><u>Manage Locations</u></h2>
    <form onSubmit={handleCreateOrUpdateLocation}>
      <div className="mb-4">
        <label className="block text-gray-700">City</label>
        <input
          type="text"
          name="city"
          value={newLocation.city}
          onChange={handleChangeLocation}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Area</label>
        <input
          type="text"
          name="area"
          value={newLocation.area}
          onChange={handleChangeLocation}
          className="border rounded p-2 w-full"
          required
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        {editingLocation ? 'Update Location' : 'Add Location'}
      </button>
    </form>

    {/* Display Locations */}
    {locations.length > 0 ? (
      <ul className="mt-4">
        {locations.map((location) => (
          <li key={location._id} className="border rounded p-4 mb-2 flex justify-between">
            <div>
              <h3 className="text-lg font-bold">{location.city}, {location.area}</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditLocation(location)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteLocation(location._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No locations found.</p>
    )}
  </div>
</div>


 

      {/* Display any errors */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminDashboard;


