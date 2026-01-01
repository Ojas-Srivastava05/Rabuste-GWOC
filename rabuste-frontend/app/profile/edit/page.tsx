"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import DynamicBackground from "@/components/DynamicBackground";
import PhoneInput from "@/components/PhoneInput";
import { useUser } from "@/contexts/UserContext";
import { Save, ArrowLeft, Loader } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { user, checkAuth } = useUser();
  
  const [form, setForm] = useState({ 
    name: "", 
    email: "",
    phoneCountryCode: "+91",
    phoneNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [success, setSuccess] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  // Load user data
  useEffect(() => {
    if (!user) {
      router.push("/auth?redirect=/profile/edit");
      return;
    }

    setForm({
      name: user.name || "",
      email: user.email || "",
      phoneCountryCode: user.phone?.countryCode || "+91",
      phoneNumber: user.phone?.number || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPhoneError("");
    setSuccess("");
    setLoading(true);

    // Validate password fields if user wants to change password
    if (changePassword) {
      if (!form.currentPassword) {
        setError("Current password is required to change password");
        setLoading(false);
        return;
      }
      if (form.newPassword.length < 8) {
        setError("New password must be at least 8 characters");
        setLoading(false);
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setError("New passwords do not match");
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const updateData: any = {
        name: form.name,
        phoneCountryCode: form.phoneCountryCode,
        phoneNumber: form.phoneNumber,
      };

      // Add password fields only if user wants to change password
      if (changePassword) {
        updateData.currentPassword = form.currentPassword;
        updateData.newPassword = form.newPassword;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/protected/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Profile updated successfully!");
      
      // Refresh user data
      await checkAuth();
      
      // Clear password fields
      setForm({
        ...form,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setChangePassword(false);

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/");
      }, 2000);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      if (errorMessage.toLowerCase().includes("phone")) {
        setPhoneError(errorMessage);
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
          <Loader className="animate-spin" size={48} style={{ color: '#B87333' }} />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen overflow-hidden" style={{ background: '#000000' }}>
        <DynamicBackground />

        <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-2xl"
          >
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 mb-6 px-4 py-2 border-2 border-[#B87333]/40 text-[#B87333] hover:bg-[#B87333]/10 transition-all duration-300"
              style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em', fontSize: '12px' }}
            >
              <ArrowLeft size={16} />
              BACK
            </button>

            <form onSubmit={handleSubmit} className="brutal-card p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 
                  className="text-4xl mb-2"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: '#FFFEF9',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                  }}
                >
                  EDIT PROFILE
                </h1>
                <div 
                  className="w-16 h-px mx-auto mb-3"
                  style={{ background: 'linear-gradient(90deg, transparent, #B87333, transparent)' }}
                />
                <p 
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: '#8B6F47' }}
                >
                  UPDATE YOUR INFORMATION
                </p>
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-4 p-3 bg-red-950/30 border-2 border-red-700/50 text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-950/30 border-2 border-green-700/50 text-green-300 text-sm">
                  ✓ {success}
                </div>
              )}

              {/* Basic Info Section */}
              <div className="mb-6">
                <h3 
                  className="text-sm mb-4 pb-2 border-b border-[#B87333]/20"
                  style={{ 
                    color: '#B87333',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '0.15em',
                  }}
                >
                  BASIC INFORMATION
                </h3>

                <input
                  type="text"
                  name="name"
                  placeholder="FULL NAME"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="auth-input"
                />

                <input
                  name="email"
                  type="email"
                  placeholder="EMAIL ADDRESS"
                  value={form.email}
                  disabled
                  className="auth-input opacity-50 cursor-not-allowed"
                  title="Email cannot be changed"
                />

                <PhoneInput
                  value={form.phoneNumber}
                  countryCode={form.phoneCountryCode}
                  onCountryChange={(code) => setForm({ ...form, phoneCountryCode: code })}
                  onNumberChange={(number) => setForm({ ...form, phoneNumber: number })}
                  error={phoneError}
                />
              </div>

              {/* Password Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#B87333]/20">
                  <h3 
                    className="text-sm"
                    style={{ 
                      color: '#B87333',
                      fontFamily: 'var(--font-heading)',
                      letterSpacing: '0.15em',
                    }}
                  >
                    CHANGE PASSWORD
                  </h3>
                  <button
                    type="button"
                    onClick={() => setChangePassword(!changePassword)}
                    className="text-xs px-3 py-1 border border-[#B87333]/40 hover:bg-[#B87333]/10 transition-colors"
                    style={{ color: '#B87333', letterSpacing: '0.1em' }}
                  >
                    {changePassword ? 'CANCEL' : 'CHANGE'}
                  </button>
                </div>

                {changePassword && (
                  <div className="space-y-4">
                    <input
                      name="currentPassword"
                      type="password"
                      placeholder="CURRENT PASSWORD"
                      value={form.currentPassword}
                      onChange={handleChange}
                      className="auth-input"
                    />

                    <input
                      name="newPassword"
                      type="password"
                      placeholder="NEW PASSWORD"
                      value={form.newPassword}
                      onChange={handleChange}
                      className="auth-input"
                    />

                    <input
                      name="confirmPassword"
                      type="password"
                      placeholder="CONFIRM NEW PASSWORD"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      className="auth-input"
                    />

                    <p className="text-xs" style={{ color: '#8B6F47' }}>
                      * Min 8 chars: uppercase, lowercase, number & special character
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                type="submit"
                className="w-full mt-6 py-4 transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: loading 
                    ? 'linear-gradient(135deg, #4A4A4A, #5A5A5A)' 
                    : 'linear-gradient(135deg, #B87333, #CD7F32)',
                  color: '#000000',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 400,
                  letterSpacing: '0.15em',
                  fontSize: '14px',
                  border: '2px solid rgba(184, 115, 51, 0.4)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    UPDATING...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    SAVE CHANGES
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Input styles */}
        <style jsx>{`
          .auth-input {
            width: 100%;
            padding: 16px;
            margin-bottom: 16px;
            background: rgba(20, 20, 20, 0.8);
            border: 2px solid rgba(184, 115, 51, 0.2);
            color: #FFFEF9;
            font-family: 'Work Sans', sans-serif;
            font-size: 14px;
            letter-spacing: 0.05em;
            text-transform: none;
            transition: all 0.3s;
          }
          .auth-input::placeholder {
            color: #8B6F47;
            letter-spacing: 0.1em;
            text-transform: none;
          }
          .auth-input:focus {
            outline: none;
            border-color: #B87333;
            background: rgba(20, 20, 20, 0.9);
            box-shadow: 0 0 0 1px rgba(184, 115, 51, 0.3);
          }
          .auth-input:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }
        `}</style>
      </div>
    </>
  );
}