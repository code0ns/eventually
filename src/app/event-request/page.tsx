"use client";
import { useState } from "react";

export default function EventRequestPage() {
  const [eventType, setEventType] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [guestCount, setGuestCount] = useState(0);
  const [preferences, setPreferences] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ eventType, location, budget, guestCount, preferences });
    // Later, we will send this to the Supabase API
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Create Event Request</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2">Event Type:</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded-md mb-4"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          required
        />

        <label className="block mb-2">Location:</label>
        <input 
          type="text" 
          className="w-full p-2 border rounded-md mb-4"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <label className="block mb-2">Budget (€):</label>
        <input 
          type="number" 
          className="w-full p-2 border rounded-md mb-4"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          required
        />

        <label className="block mb-2">Guest Count:</label>
        <input 
          type="number" 
          className="w-full p-2 border rounded-md mb-4"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          required
        />

        <label className="block mb-2">Preferences:</label>
        <textarea 
          className="w-full p-2 border rounded-md mb-4"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
          placeholder='e.g. "Luxury theme, vegan catering"'
        />

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md">
          Submit Request
        </button>
      </form>
    </main>
  );
}
