"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function ActionPage() {
  const params = useParams();
  const [settings, setSettings] = useState<PageSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      if (typeof window === 'undefined') return;

      try {
        const id = params.id as string;
        const storageKey = `page_${id}`;
        const savedSettingsJson = localStorage.getItem(storageKey);

        if (savedSettingsJson) {
          try {
            const pageSettings = JSON.parse(savedSettingsJson);

            if (pageSettings) {
              setSettings({
                username: pageSettings.username,
                displayName: pageSettings.displayName,
                profilePicUrl: pageSettings.profilePicUrl,
                isVerified: pageSettings.isVerified !== undefined ? pageSettings.isVerified : true,
                tweetLinks: pageSettings.tweetLinks || []
              });
            }
          } catch (parseError) {
            console.error("Error parsing settings JSON:", parseError);
          }
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [params]);

  if (loading) {
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
          <p className="text-gray-600">The requested page does not exist.</p>
        </div>
      </div>
    );
  }

  return <XHelpCenterPage settings={settings} />;
}
