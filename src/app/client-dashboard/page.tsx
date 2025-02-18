"use client";

import AuthGuard from "@/app/components/AuthGuard";
import Link from "next/link";
import { motion } from "framer-motion";

const ClientDashboard = () => {
  return (
    <AuthGuard requiredRole="client">
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <motion.aside
          className="w-64 bg-blue-900 text-white flex flex-col p-6 space-y-6"
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">Client Dashboard</h2>
          <nav className="flex flex-col space-y-4">
            <Link href="/client-dashboard" className="hover:underline">🏠 Home</Link>
            <Link href="/event-request" className="hover:underline">📅 Events</Link>
            <Link href="/messages" className="hover:underline">💬 Messages</Link>
            <Link href="/profile" className="hover:underline">👤 Profile</Link>
          </nav>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.h1
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Welcome to Your Client Dashboard
          </motion.h1>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ClientDashboard;
