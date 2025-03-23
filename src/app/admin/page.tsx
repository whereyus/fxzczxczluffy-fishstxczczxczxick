"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TweetLink {
  url: string;
  date: string;
  imageUrl?: string;
  title?: string;
  comments?: string;
}

interface PageData {
  username: string;
  displayName: string;
  profilePicUrl: string;
  isVerified: boolean;
  tweetLinks: TweetLink[];
  createdAt: string;
}

export default function AdminPanel() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [profilePicUrl, setProfilePicUrl] = useState("");
  const [isVerified, setIsVerified] = useState(true);
  const [tweetLinks, setTweetLinks] = useState<TweetLink[]>([{ url: "", date: "" }]);
  const [savedPages, setSavedPages] = useState<Record<string, PageData>>({});
  const router = useRouter();

  // Load saved pages on component mount
  useEffect(() => {
    const loadSavedPages = () => {
      if (typeof window === 'undefined') return;

      const pages: Record<string, PageData> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('page_')) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              pages[key] = JSON.parse(value);
            }
          } catch (error) {
            console.error(`Error parsing saved page: ${key}`, error);
          }
        }
      }
      setSavedPages(pages);
    };

    loadSavedPages();
  }, []);

  // Tweet link'lerini yönetme
  const addTweetLink = () => {
    setTweetLinks([...tweetLinks, { url: "", date: "" }]);
  };

  const updateTweetLink = (index: number, field: keyof TweetLink, value: string) => {
    const newTweetLinks = [...tweetLinks];
    newTweetLinks[index][field] = value;
    setTweetLinks(newTweetLinks);
  };

  const removeTweetLink = (index: number) => {
    setTweetLinks(tweetLinks.filter((_, i) => i !== index));
  };

  const handleCreatePage = () => {
    if (!username.trim() || !displayName.trim()) {
      alert("Username and Display Name are required!");
      return;
    }

    // Rastgele 7 haneli bir ID oluştur
    const pageId = Math.floor(1000000 + Math.random() * 9000000);

    // Ayarları localStorage'a kaydet
    const pageSettings = {
      username,
      displayName,
      profilePicUrl,
      isVerified,
      tweetLinks: tweetLinks.filter(link => link.url.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const key = `page_${pageId}`;
      localStorage.setItem(key, JSON.stringify(pageSettings));

      // Update the saved pages state
      setSavedPages(prev => ({
        ...prev,
        [key]: pageSettings
      }));
    }

    // Yeni sayfaya yönlendir
    router.push(`/action/${pageId}`);
  };

  const handleDeletePage = (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);

      // Update the saved pages state
      setSavedPages(prev => {
        const newPages = { ...prev };
        delete newPages[key];
        return newPages;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#15202b] text-white p-8">
      <div className="max-w-2xl mx-auto bg-[#1e2732] rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8 mr-2">
            <path
              d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
              fill="currentColor"
            />
          </svg>
          X Help Center Admin Panel
        </h1>

        <div className="space-y-6">
          {/* Display Name Input */}
          <div className="space-y-2">
            <label className="block font-medium">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#273340] text-white px-3 py-2 rounded-lg focus:outline-none"
              placeholder="Display Name"
            />
          </div>

          {/* Username Input */}
          <div className="space-y-2">
            <label className="block font-medium">Username</label>
            <div className="flex items-center">
              <span className="bg-[#273340] px-3 py-2 rounded-l-lg text-gray-400">@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-[#273340] text-white px-3 py-2 rounded-r-lg focus:outline-none"
                placeholder="username"
              />
            </div>
          </div>

          {/* Profile Picture URL */}
          <div className="space-y-2">
            <label className="block font-medium">Profile Picture URL</label>
            <input
              type="text"
              value={profilePicUrl}
              onChange={(e) => setProfilePicUrl(e.target.value)}
              className="w-full bg-[#273340] text-white px-3 py-2 rounded-lg focus:outline-none"
              placeholder="https://example.com/profile.jpg"
            />
          </div>

          {/* Tweet Links */}
          <div className="space-y-3">
            <label className="block font-medium">Tweet Links</label>
            {tweetLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateTweetLink(index, 'url', e.target.value)}
                  className="flex-1 bg-[#273340] text-white px-3 py-2 rounded-lg focus:outline-none"
                  placeholder="Tweet URL"
                />
                <input
                  type="date"
                  value={link.date}
                  onChange={(e) => updateTweetLink(index, 'date', e.target.value)}
                  className="w-32 bg-[#273340] text-white px-3 py-2 rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => removeTweetLink(index)}
                  className="px-3 py-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  X
                </button>
              </div>
            ))}
            <button
              onClick={addTweetLink}
              className="w-full bg-[#273340] text-white py-2 rounded-lg hover:bg-[#2c3947]"
            >
              + Add Tweet Link
            </button>
          </div>

          {/* Verification Toggle */}
          <div className="flex items-center justify-between bg-[#273340] p-4 rounded-lg">
            <span>Verification Badge</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Preview */}
          <div className="mt-8 p-4 bg-[#273340] rounded-lg">
            <h2 className="font-medium mb-4">Preview:</h2>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
                {profilePicUrl && (
                  <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <div className="font-bold flex items-center">
                  {displayName || "Display Name"}
                  {isVerified && (
                    <span className="ml-1 text-[#1D9BF0]">
                      <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 inline-block fill-current">
                        <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="text-gray-400">@{username || "username"}</div>
              </div>
            </div>

            {/* Tweet Links Preview */}
            {tweetLinks.some(link => link.url.trim() !== "") && (
              <div className="mt-4 border-t border-gray-600 pt-4">
                <h3 className="text-sm font-medium mb-2">Tweet Links:</h3>
                {tweetLinks.map((link, index) => (
                  link.url.trim() && (
                    <div key={index} className="text-sm text-gray-400 flex justify-between">
                      <span className="truncate">{link.url}</span>
                      {link.date && <span>{link.date}</span>}
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreatePage}
            className="w-full bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Create Action Page
          </button>

          {/* Created Pages List */}
          <div className="mt-8">
            <h2 className="font-medium mb-4">Created Pages:</h2>
            <div className="space-y-2">
              {Object.entries(savedPages).map(([key, pageData]) => {
                const pageId = key.replace('page_', '');
                return (
                  <div key={key} className="flex justify-between items-center bg-[#273340] p-3 rounded-lg">
                    <div>
                      <div className="font-medium">{pageData.displayName}</div>
                      <div className="text-sm text-gray-400">@{pageData.username}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/action/${pageId}`)}
                        className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeletePage(key)}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
