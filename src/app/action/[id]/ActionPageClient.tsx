"use client";

import { useEffect, useState } from "react";
import XHelpCenterPage from "@/components/XHelpCenterPage";

interface TweetLink {
  url: string;
  date: string;
  imageUrl?: string;
  title?: string;
  comments?: string;
}

interface PageSettings {
  username: string;
  displayName: string;
  profilePicUrl: string;
  isVerified: boolean;
  tweetLinks: TweetLink[];
}

export default function ActionPageClient({ params }: { params: { id: string } }) {
  const [settings, setSettings] = useState<PageSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      if (typeof window === 'undefined') return;

      try {
        // localStorage'dan ayarları al
        const storedSettings = localStorage.getItem(`page_${params.id}`);
        if (storedSettings) {
          const parsedSettings = JSON.parse(storedSettings);
          setSettings({
            username: parsedSettings.username,
            displayName: parsedSettings.displayName,
            profilePicUrl: parsedSettings.profilePicUrl,
            isVerified: parsedSettings.isVerified !== undefined ? parsedSettings.isVerified : true,
            tweetLinks: parsedSettings.tweetLinks || []
          });
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested action page does not exist.</p>
        </div>
      </div>
    );
  }

  return <XHelpCenterPage settings={settings} />;
}
