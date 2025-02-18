"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const Dashboard = () => {
  const [eventRequests, setEventRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    fetchEventRequests();
    subscribeToRealtimeUpdates();
    fetchUnreadMessages();
  }, []);

  // Fetch event requests from Supabase
  const fetchEventRequests = async () => {
    try {
      const { data, error } = await supabase.from("event_requests").select("*");
      if (error) throw error;
      setEventRequests(data);
    } catch (err) {
      console.error("Error fetching event requests:", err);
    } finally {
      setLoading(false);
    }
  };

  // Subscribe to real-time updates
  const subscribeToRealtimeUpdates = () => {
    supabase
      .channel("realtime:event_requests")
      .on("postgres_changes", { event: "*", schema: "public", table: "event_requests" }, (payload) => {
        setEventRequests((prev) => [payload.new, ...prev]); // Add new event requests live
      })
      .subscribe();
  };

  // Fetch unread messages count
  const fetchUnreadMessages = async () => {
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("is_read", false);

      if (error) throw error;
      setUnreadMessages(count || 0);
    } catch (err) {
      console.error("Error fetching unread messages:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        className="w-64 bg-blue-900 text-white flex flex-col p-6 space-y-6"
        initial={{ x: -200 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <Link href="/home" className="hover:underline">🏠 Home</Link>
          <Link href="/event-request" className="hover:underline">📅 Events</Link>
          <Link href="/messages" className="hover:underline relative">
            💬 Messages
            {unreadMessages > 0 && (
              <motion.span
                className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute -top-2 -right-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
              >
                {unreadMessages}
              </motion.span>
            )}
          </Link>
          <Link href="/profile" className="hover:underline">👤 Profile</Link>
        </nav>
        <Link
          href="/event-request"
          className="bg-green-500 text-white text-center py-2 rounded-md"
        >
          ➕ Create New Request
        </Link>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <motion.h1
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Event Requests
        </motion.h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {eventRequests.length === 0 ? (
              <p>No event requests found.</p>
            ) : (
              eventRequests.map((event) => (
                <motion.div
                  key={event.id}
                  className="bg-white p-4 shadow rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="text-gray-600">📅 {new Date(event.date).toDateString()}</p>
                  <p className={`text-sm mt-2 ${
                    event.status === "Open"
                      ? "text-blue-500"
                      : event.status === "Reviewing"
                      ? "text-yellow-500"
                      : event.status === "Accepted"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}>
                    Status: {event.status}
                  </p>
                  <Link href={`/proposal/${event.id}`}>
                    <motion.button
                      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
                      whileHover={{ scale: 1.1 }}
                    >
                      View Proposals
                    </motion.button>
                  </Link>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
