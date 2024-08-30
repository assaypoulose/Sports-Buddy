import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ sport: '', country: '', city: '', time: '', description: '' });
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BACKEND_URL;

  // Fetch user's events
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found, authorization required');

        const response = await axios.get(`${baseURL}/users/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch events');
        console.error(err);
      }
    };

    fetchData();
  }, []);

  // Handle input changes for creating or editing events
  const handleChange = (e) => {
    setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
  };

  // Create or Update Event
  const handleSubmitEvent = async (e) => {
    e.preventDefault();

    const eventData = {
      sport: newEvent.sport,
      location: {
        country: newEvent.country,
        city: newEvent.city,
      },
      time: newEvent.time,
      description: newEvent.description,
    };

    try {
      if (editingEvent) {
        // Update the event
        const response = await axios.put(`${baseURL}/users/events/${editingEvent._id}`, eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEvents(events.map((e) => (e._id === editingEvent._id ? response.data : e)));
        setEditingEvent(null);
      } else {
        // Create a new event
        const response = await axios.post(`${baseURL}/users/events`, eventData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setEvents([...events, response.data]);
      }
      setNewEvent({ sport: '', country: '', city: '', time: '', description: '' });
    } catch (err) {
      setError(editingEvent ? 'Failed to update event' : 'Failed to create event');
    }
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`${baseURL}/users/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(events.filter((e) => e._id !== eventId));
    } catch (err) {
      setError('Failed to delete event');
      console.log(err);
    }
  };

  // Handle Edit button click
  const handleEditEvent = (event) => {
    setNewEvent({
      sport: event.sport,
      country: event.location.country,
      city: event.location.city,
      time: event.time.slice(0, 16),  // Format the time correctly
      description: event.description,
    });
    setEditingEvent(event);
  };
  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center container mx-auto p-4">
      <h1 className="items-center text-2xl font-bold mb-4">User Dashboard</h1>

      <div className="flex justify-between">
        {/* Create Event Form */}
        <div className="w-1/2">
          <form onSubmit={handleSubmitEvent} className="mb-8 w-[400px]">
            <h2 className="text-xl mb-2"><u>{editingEvent ? 'Edit Event' : 'Create New Event'}</u></h2>
            <div className="mb-4">
              <label className="block text-gray-700">Sport</label>
              <input
                type="text"
                name="sport"
                value={newEvent.sport}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={newEvent.country}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={newEvent.city}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Time</label>
              <input
                type="datetime-local"
                name="time"
                value={newEvent.time}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                className="border rounded p-2 w-full"
                required
              />
            </div>
            <div>
            <button type="submit" className="w-[150px] bg-blue-500 text-white p-2 rounded">
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-[150px] bg-gray-500 text-white p-2 rounded ml-10 mt-8"
            >
              Logout
            </button>
            </div>
          </form>
        </div>

        {/* Display Events */}
        <div className="w-1/2">
          <h2 className="text-xl mb-4"><u>Your Events</u></h2>
          {events.length > 0 ? (
            <ul className="space-y-4">
              {events.map((event) => (
                <li key={event._id} className="w-[400px] border rounded p-4">
                  <h3 className="text-lg font-bold">{event.sport}</h3>
                  <p>Location: {event.location.city}, {event.location.country}</p>
                  <p>Time: {new Date(event.time).toLocaleString()}</p>
                  <p>Description: {event.description}</p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="bg-yellow-500 text-white p-2 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="bg-red-500 text-white p-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No events found.</p>
          )}
        </div>
      </div>

      {/* Display any errors */}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default UserDashboard;
