"use client";

import React, { useEffect, useState } from "react";

interface HeaderProps {
  settings?: {
    username: string;
    displayName: string;
    profilePicUrl: string;
    isVerified: boolean;
  };
}

export default function Header({ settings }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`w-full border-b border-gray-200 py-6 px-4 sticky top-0 bg-white z-50 transition-all duration-300 ease-in-out
      ${scrolled ? 'shadow-md py-4' : 'shadow-sm'}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="currentColor"
            />
          </svg>
          <span className="font-semibold text-2xl">Help Center</span>
        </div>

        {/* Profil Bilgileri */}
        {settings && (
          <div className="flex items-center gap-3">
            <div className="text-right mr-3">
              <div className="flex items-center justify-end gap-1">
                <span className="font-medium">{settings.displayName}</span>
                {settings.isVerified && (
                  <span className="text-[#1D9BF0]">
                    <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 inline-block fill-current">
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="text-gray-500 text-sm">@{settings.username}</div>
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
              {settings.profilePicUrl && (
                <img 
                  src={settings.profilePicUrl} 
                  alt={settings.displayName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png";
                  }}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
