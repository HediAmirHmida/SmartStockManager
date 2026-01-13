'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string, password?: string, confirmPassword?: string, name?: string}>({});
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleInputChange = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    if (field === 'email') {
      setEmail(value);
      if (value && !validateEmail(value)) {
        newErrors.email = 'Please enter a valid email';
      } else {
        delete newErrors.email;
      }
    } else if (field === 'password') {
      setPassword(value);
      if (value && !validatePassword(value)) {
        newErrors.password = 'Password must be at least 6 characters';
      } else {
        delete newErrors.password;
      }
    } else if (field === 'confirmPassword') {
      setConfirmPassword(value);
      if (value && value !== password) {
        newErrors.confirmPassword = 'Passwords do not match';
      } else {
        delete newErrors.confirmPassword;
      }
    } else if (field === 'name') {
      setName(value);
      if (value && value.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      } else {
        delete newErrors.name;
      }
    }
    
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setErrors({});

    const currentErrors: any = {};
    if (!email) currentErrors.email = 'Email is required';
    else if (!validateEmail(email)) currentErrors.email = 'Please enter a valid email';
    
    if (!password) currentErrors.password = 'Password is required';
    else if (!validatePassword(password)) currentErrors.password = 'Password must be at least 6 characters';
    
    if (!isLogin) {
      if (!name) currentErrors.name = 'Name is required';
      else if (name.trim().length < 2) currentErrors.name = 'Name must be at least 2 characters';
      
      if (!confirmPassword) currentErrors.confirmPassword = 'Please confirm your password';
      else if (password !== confirmPassword) currentErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      setIsLoading(false);
      return;
    }

    const payload = { email, password, name };

    if (!isLogin) {
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
        setIsSuccessMessage(false);
        setIsLoading(false);
        return;
      }

      // Signup successful - show success message and switch to login mode
      setMessage('Account created successfully! Please login with your credentials.');
      setIsSuccessMessage(true);
      setIsLogin(true);
      // Clear the form fields
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setIsLoading(false);
      return;
    }

    // Login flow
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Login failed:", data);
        setMessage(data.error || 'Login failed');
        setIsSuccessMessage(false);
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (error: unknown) {
      setIsSuccessMessage(false);
      if (error instanceof Error) {
        setMessage(error.message);
        console.error("Frontend error:", error.message);
      } else {
        console.error("Unknown error:", error);
        setMessage("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-[#1c1c1e]/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/10"
      >
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-2"
          >
            Smart Stock Manager
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-400 text-sm"
          >
            {isLogin ? "Welcome Back 👋" : "Create Your Account"}
          </motion.p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name Field (Signup only) */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                  value={name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required={!isLogin}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
              </div>
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.name}
                </p>
              )}
            </motion.div>
          )}

          {/* Email Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                required
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email}
              </p>
            )}
          </motion.div>

          {/* Password Field */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full pl-10 pr-12 py-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                required
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password}
              </p>
            )}
          </motion.div>

          {/* Confirm Password Field (Signup only) */}
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 rounded-lg bg-[#2a2a2d] text-white placeholder-gray-400 border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                  required={!isLogin}
                  value={confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-error" className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </p>
              )}
            </motion.div>
          )}

          {/* Remember Me Checkbox (Login only) */}
          {isLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="flex items-center"
            >
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-[#2a2a2d] border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                Remember me for 30 days
              </label>
            </motion.div>
          )}

          {/* Message Display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: message ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {message && (
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${
                isSuccessMessage 
                  ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}>
                {isSuccessMessage ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p className="text-sm">{message}</p>
              </div>
            )}
          </motion.div>

          {/* Submit Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-200 rounded-lg font-semibold shadow-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {isLogin ? "Logging in..." : "Creating Account..."}
              </>
            ) : (
              isLogin ? "Login" : "Sign Up"
            )}
          </motion.button>
        </form>

        {/* Toggle Login/Signup */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-8"
        >
          <span className="text-sm text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage('');
              setIsSuccessMessage(false);
              setErrors({});
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setName('');
            }}
            className="text-sm text-blue-400 hover:text-blue-300 hover:underline font-medium transition-colors"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
