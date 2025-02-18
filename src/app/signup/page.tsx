"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpWithEmail } from "@/app/lib/auth";
import Link from "next/link";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client"); // Default role: Client
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await signUpWithEmail(name, email, password, role);

      // Redirect based on role
      if (userData.role === "client") router.push("/client-dashboard");
      else if (userData.role === "agency") router.push("/agency-dashboard");
      else if (userData.role === "admin") router.push("/admin-dashboard");
      else throw new Error("Unknown role");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSignup} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <label className="block mb-2">Full Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="block mb-2">Email:</label>
        <input
          type="email"
          className="w-full p-2 border rounded-md mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2">Password:</label>
        <input
          type="password"
          className="w-full p-2 border rounded-md mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="block mb-2">Are you a Client or an Agency?</label>
        <select
          className="w-full p-2 border rounded-md mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="client">Client</option>
          <option value="agency">Agency</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="w-full bg-green-500 text-white p-3 rounded-md">
          Sign Up
        </button>
      </form>

      {/* Login Option */}
      <p className="mt-4 text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
};

export default SignupPage;
