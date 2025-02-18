"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/app/lib/auth";
import Link from "next/link";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userData = await signInWithEmail(email, password);

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
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
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

        <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md">
          Login
        </button>
      </form>

      {/* Sign Up Option */}
      <p className="mt-4 text-gray-600">
        Don't have an account?{" "}
        <Link href="/signup" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </main>
  );
};

export default LoginPage;
