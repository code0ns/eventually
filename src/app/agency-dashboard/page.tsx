"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import AuthGuard from "@/app/components/AuthGuard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the Event Request type
type EventRequest = {
  id: number;
  title: string;
  date: string;
  status: "Open" | "Reviewing" | "Accepted" | "Rejected";
};

const AgencyDashboard = () => {
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
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
      const { data, error } = await supabase
        .from("event_requests")
        .select("id, title, date, status") // Ensure correct fields
        .eq("status", "Open");

      if (error) throw error;
      setEventRequests(data as EventRequest[]);
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
        setEventRequests((prev) => {
          const updatedEvents = prev.filter((event) => (event as EventRequest).id !== (payload.new as EventRequest).id);
          return [payload.new as EventRequest, ...updatedEvents];
        });
      })
      .subscribe();
  };

  // Fetch unread messages count
  const fetchUnreadMessages = async () => {
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .eq("is_read", false)
        .eq("recipient_role", "agency");

      if (error) throw error;
      setUnreadMessages(count || 0);
    } catch (err) {
      console.error("Error fetching unread messages:", err);
    }
  };

  // Accept a proposal
  const handleAcceptProposal = async (id: number) => {
    await supabase.from("event_requests").update({ status: "Accepted" }).eq("id", id);
    fetchEventRequests();
  };

  // Reject a proposal
  const handleRejectProposal = async (id: number) => {
    await supabase.from("event_requests").update({ status: "Rejected" }).eq("id", id);
    fetchEventRequests();
  };

  return (
    <AuthGuard requiredRole="agency">
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <motion.aside
          className="w-64 bg-blue-900 text-white flex flex-col p-6 space-y-6"
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">Agency Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <Link href="/agency-dashboard" className="hover:underline">🏠 Home</Link>
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
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <motion.h1
            className="text-3xl font-bold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Available Event Requests
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
                <p>No open event requests.</p>
              ) : (
                eventRequests.map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-white p-4 shadow rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <h2 className="text-xl font-semibold">{event.title}</h2>
                    <p className="text-gray-600">📅 {new Date(event.date).toDateString()}</p>
                    <p className="text-blue-500 text-sm mt-2">Status: {event.status}</p>

                    <div className="mt-4 flex space-x-2">
                      <motion.button
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleAcceptProposal(event.id)}
                      >
                        Accept
                      </motion.button>

                      <motion.button
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleRejectProposal(event.id)}
                      >
                        Reject
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </div>
      </div>
    </AuthGuard>
  );
};

export default AgencyDashboard;
