"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import AuthGuard from "@/app/components/AuthGuard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define User & Event Types
type User = {
  id: string;
  name: string;
  email: string;
  role: "client" | "agency" | "admin";
};

type EventRequest = {
  id: number;
  title: string;
  date: string;
  status: "Open" | "Reviewing" | "Accepted" | "Rejected";
};

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [eventRequests, setEventRequests] = useState<EventRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchEventRequests();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("id, name, email, role");
      if (error) throw error;
      setUsers(data as User[]);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all event requests
  const fetchEventRequests = async () => {
    try {
      const { data, error } = await supabase.from("event_requests").select("id, title, date, status");
      if (error) throw error;
      setEventRequests(data as EventRequest[]);
    } catch (err) {
      console.error("Error fetching event requests:", err);
    }
  };

  // Change user role
  const updateUserRole = async (id: string, newRole: "client" | "agency" | "admin") => {
    const { error } = await supabase.from("users").update({ role: newRole }).eq("id", id);
    if (!error) fetchUsers(); // Refresh user list
  };

  return (
    <AuthGuard requiredRole="admin">
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <motion.aside
          className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-6"
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <a href="/admin-dashboard" className="hover:underline">📊 Overview</a>
            <a href="/admin-users" className="hover:underline">👥 Manage Users</a>
            <a href="/admin-events" className="hover:underline">📅 Event Requests</a>
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
            Admin Dashboard
          </motion.h1>

          {/* User Management */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">👥 User Management</h2>
            {loading ? (
              <p>Loading users...</p>
            ) : (
              <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.role}</td>
                      <td className="p-3">
                        {user.role !== "admin" && (
                          <select
                            className="border p-2 rounded"
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as "client" | "agency" | "admin")}
                          >
                            <option value="client">Client</option>
                            <option value="agency">Agency</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          {/* Event Requests */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">📅 Active Event Requests</h2>
            {loading ? (
              <p>Loading event requests...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {eventRequests.map((event) => (
                  <motion.div
                    key={event.id}
                    className="bg-white p-4 shadow rounded-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <h3 className="text-xl font-semibold">{event.title}</h3>
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
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboard;
