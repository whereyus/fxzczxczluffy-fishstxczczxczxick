"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface TweetLink {
  url: string;
  date: string;
  imageUrl: string;
  title: string;
  comments?: string;
}

interface Settings {
  id: string;
  username: string;
  displayName: string;
  profilePicUrl: string;
  isVerified: boolean;
  tweetLinks: TweetLink[];
  createdAt: string;
}

export default function AdminPanel() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<Settings[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    profilePicUrl: "",
    tweetLinks: [] as TweetLink[],
    isVerified: true
  });
  const [showCreatedPages, setShowCreatedPages] = useState(false);
  const [newTweet, setNewTweet] = useState({
    url: "",
    imageUrl: "",
    title: "",
    date: new Date().toLocaleDateString(),
    comments: "2.8k comments"
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isAuthLocal = localStorage.getItem("adminAuthenticated") === "true";
        if (!isAuthLocal) {
          router.push("/sdadasddddaadsdsa");
        } else {
          setIsLoading(false);
          const savedSettings = localStorage.getItem("pageSettings");
          if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        router.push("/sdadasddddaadsdsa");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("adminAuthenticated");
      document.cookie = "adminAuth=false; path=/; max-age=0";
      router.push("/sdadasddddaadsdsa");
    }
  };

  const handleCreatePage = () => {
    // Validasyon kontrolleri
    if (!formData.username.trim()) {
      alert("Please enter a username");
      return;
    }
    if (!formData.profilePicUrl.trim()) {
      alert("Please enter a profile picture URL");
      return;
    }
    if (formData.tweetLinks.length === 0) {
      alert("Please add at least one tweet link");
      return;
    }

    const newId = Math.floor(1000000 + Math.random() * 9000000).toString();
    
    const newSettings: Settings = {
      id: newId,
      username: formData.username,
      displayName: formData.username,
      profilePicUrl: formData.profilePicUrl,
      isVerified: formData.isVerified,
      tweetLinks: formData.tweetLinks,
      createdAt: new Date().toLocaleString()
    };

    const updatedSettings = [newSettings, ...settings]; // Yeni sayfayı başa ekle
    setSettings(updatedSettings);
    localStorage.setItem("pageSettings", JSON.stringify(updatedSettings));

    // Form verilerini sıfırla
    setFormData({
      username: "",
      profilePicUrl: "",
      tweetLinks: [],
      isVerified: true
    });

    // Oluşturulan sayfalar listesini göster
    setShowCreatedPages(true);
  };

  const handleDeletePage = (id: string) => {
    if (confirm("Are you sure you want to delete this page?")) {
      const updatedSettings = settings.filter(setting => setting.id !== id);
      setSettings(updatedSettings);
      localStorage.setItem("pageSettings", JSON.stringify(updatedSettings));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const handleAddTweet = () => {
    if (!newTweet.url || !newTweet.imageUrl || !newTweet.title) {
      alert("Please fill all tweet fields");
      return;
    }

    setFormData(prev => ({
      ...prev,
      tweetLinks: [...prev.tweetLinks, newTweet]
    }));

    // Form temizle
    setNewTweet({
      url: "",
      imageUrl: "",
      title: "",
      date: new Date().toLocaleDateString(),
      comments: "2.8k comments"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#15202b]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#15202b] text-white p-3 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                  fill="currentColor"
                />
              </svg>
              <h1 className="text-xl font-bold">X Help Center Admin Panel</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowCreatedPages(!showCreatedPages)}
                className="text-[#1d9bf0] hover:underline text-sm sm:text-base"
              >
                {showCreatedPages ? "Hide" : "Show"} Created Pages ({settings.length})
              </button>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-600 text-sm sm:text-base"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Created Pages List */}
          {showCreatedPages && settings.length > 0 && (
            <div className="mb-8 bg-[#1e2732] rounded-lg p-3 sm:p-4">
              <h2 className="text-lg font-semibold mb-4">Created Pages</h2>
              <div className="space-y-4">
                {settings.map((setting) => (
                  <div key={setting.id} className="bg-[#273340] p-3 sm:p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden flex-shrink-0">
                          {setting.profilePicUrl && (
                            <img
                              src={setting.profilePicUrl}
                              alt={setting.username}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-medium truncate">{setting.username}</span>
                            {setting.isVerified && (
                              <span className="text-[#1d9bf0] flex-shrink-0">
                                <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 inline-block fill-current">
                                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                                </svg>
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-400 truncate">@{setting.username}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          onClick={() => copyToClipboard(`${window.location.origin}/action/${setting.id}`)}
                          className="text-[#1d9bf0] hover:underline text-sm flex-1 sm:flex-none"
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => handleDeletePage(setting.id)}
                          className="text-red-500 hover:text-red-600 text-sm flex-1 sm:flex-none"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Created: {setting.createdAt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Section */}
          <div className="bg-[#1e2732] rounded-lg p-4 sm:p-6 space-y-4">
            <h2 className="text-lg font-semibold mb-4">Create New Page</h2>
            
            {/* Form inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Username
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 bg-[#273340] border border-gray-600 rounded-md text-white"
                  placeholder="elonmusk"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">
                  Profile Picture URL
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.profilePicUrl}
                  onChange={(e) => setFormData({ ...formData, profilePicUrl: e.target.value })}
                  className="w-full p-2 bg-[#273340] border border-gray-600 rounded-md text-white"
                  placeholder="https://example.com/profile.jpg"
                />
              </div>

              {/* Verification Toggle - Mobil uyumlu */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#273340] p-4 rounded-md gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Verification Badge
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    Show blue verification badge on profile
                  </p>
                </div>
                <div 
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out ${
                    formData.isVerified ? 'bg-[#1d9bf0]' : 'bg-gray-600'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, isVerified: !prev.isVerified }))}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                      formData.isVerified ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>

              {/* Tweet ekleme bölümü */}
              <div className="bg-[#273340] p-4 rounded-md">
                <h3 className="text-sm font-medium mb-3 text-gray-300">Add Tweet</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Tweet URL"
                    value={newTweet.url}
                    onChange={(e) => setNewTweet(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full p-2 bg-[#1e2732] border border-gray-600 rounded-md text-white text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Tweet Image URL"
                    value={newTweet.imageUrl}
                    onChange={(e) => setNewTweet(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full p-2 bg-[#1e2732] border border-gray-600 rounded-md text-white text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Tweet Title"
                    value={newTweet.title}
                    onChange={(e) => setNewTweet(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-2 bg-[#1e2732] border border-gray-600 rounded-md text-white text-sm"
                  />
                  <button
                    onClick={handleAddTweet}
                    className="w-full bg-[#1d9bf0] text-white py-2 rounded-md hover:bg-[#1a8cd8] transition-colors text-sm"
                  >
                    Add Tweet
                  </button>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <button
              onClick={handleCreatePage}
              className="w-full bg-[#1d9bf0] text-white py-3 rounded-md hover:bg-[#1a8cd8] transition-colors text-base sm:text-lg font-medium"
            >
              Create Action Page
            </button>

            {/* Info Text */}
            <div className="text-xs sm:text-sm text-gray-400">
              Created pages will be available at: /action/[id]
              <br />
              Example: /action/2471243
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 