'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');  // New state for the name field
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || (!isLogin && !name)) {
      setMessage('Please provide all required fields (email, password, name)');
      return;
    }

    const payload = { email, password, name };

    if (!isLogin) {
      if (password !== confirmPassword) {
        setMessage("Passwords don't match");
        return;
      }

      // Step 1: Sign up the user
      const signupRes = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        console.error("Signup failed:", signupData);
        setMessage(signupData.error || 'Signup failed');
        return;
      }

      // Step 2: Auto-login the user
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        console.error("Login after signup failed:", loginData);
        setMessage(loginData.error || 'Login after signup failed');
        return;
      }

      // Step 3: Redirect to dashboard
      router.push('/dashboard');
      return;
    }

    // Login flow
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data);
        setMessage(data.error || 'Login failed');
        return;
      }

      router.push('/dashboard');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
        console.error("Frontend error:", error.message);
      } else {
        console.error("Unknown error:", error);
        setMessage("An unknown error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1c1c1e] shadow-2xl rounded-xl p-10 w-full max-w-md backdrop-blur-sm border border-gray-700"
      >
        <h1 className="text-4xl font-bold text-center mb-6 tracking-tight">
          {isLogin ? "Welcome Back 👋" : "Create an Account"}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm">Name</label>
            {!isLogin && (
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block mb-1 text-sm">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full p-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          {message && <p className="text-red-400 text-center">{message}</p>}

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition duration-200 rounded-lg font-semibold shadow-md"
          >
            {isLogin ? "Login" : "Sign Up"}
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <span className="text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
            }}
            className="text-sm text-blue-400 hover:underline ml-1"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
