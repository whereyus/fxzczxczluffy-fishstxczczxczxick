"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Sayfa yüklendiğinde oturum kontrolü yap
  useEffect(() => {
    // Cookie kontrolü yap
    const checkAuth = () => {
      try {
        const isAuthLocal = localStorage.getItem("adminAuthenticated") === "true";
        if (isAuthLocal) {
          router.push("/sdadasddddaadsdsa/panel");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (password === "admin123!@#") {
        // LocalStorage'a kaydet
        localStorage.setItem("adminAuthenticated", "true");
        
        // Cookie ayarla (1 günlük)
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);
        document.cookie = `adminAuth=true; path=/; expires=${expirationDate.toUTCString()}; secure`;
        
        // Kısa bir gecikme ekle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Admin paneline yönlendir
        router.push("/sdadasddddaadsdsa/panel");
      } else {
        setError("Invalid password");
        setPassword("");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(""); // Kullanıcı yazmaya başladığında hata mesajını temizle
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <div className="flex justify-center mb-6">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="currentColor"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Panel</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#1D9BF0] text-white py-3 px-4 rounded-md hover:bg-[#1A8CD8] transition-colors font-medium"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 