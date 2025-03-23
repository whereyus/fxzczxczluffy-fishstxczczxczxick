"use client";

import React, { useState } from "react";
import PasswordModal from "./PasswordModal";
import TweetModal from "./TweetModal";

interface TweetLink {
  url: string;
  date: string;
  imageUrl: string;
  title: string;
  comments?: string;
}

interface ActionNeededContentProps {
  settings?: {
    username: string;
    displayName: string;
    profilePicUrl: string;
    isVerified: boolean;
    tweetLinks: TweetLink[];
  };
}

export default function ActionNeededContent({ settings }: ActionNeededContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState<TweetLink | null>(null);

  const username = settings?.username || "elonmusk";
  const displayName = settings?.displayName || "Elon Musk";
  const profilePicUrl = settings?.profilePicUrl;
  const isVerified = settings?.isVerified ?? true;
  const tweetLinks = settings?.tweetLinks || [];

  const handleSubmitAppeal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full bg-white border border-gray-200 rounded-lg p-8 relative overflow-hidden">
        {/* Background logo watermark */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 opacity-10 pointer-events-none">
          <div className="w-[450px] h-[450px]">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-600 overflow-hidden">
              {profilePicUrl && (
                <img src={profilePicUrl} alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <div className="font-bold flex items-center">
                {displayName}
                {isVerified && (
                  <span className="ml-1 text-[#1D9BF0]">
                    <svg viewBox="0 0 24 24" aria-label="Verified account" className="w-4 h-4 inline-block fill-current">
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="text-gray-500">@{username}</div>
            </div>
          </div>

          <p className="mb-4 text-[15px] leading-6">
            We are contacting you regarding an urgent copyright violation report filed against your account. After a thorough investigation, it has been confirmed that your account is involved in activities that violate copyright laws.
          </p>

          <div className="mb-4">
            <p className="font-semibold text-[15px]">Details of the Violation:</p>
            <p className="font-semibold mt-2 text-[15px]">Infringing Content URLs:</p>
            {settings?.tweetLinks.map((link, index) => (
              <div key={index} className="flex justify-between items-center text-sm mt-1">
                <button
                  onClick={() => setSelectedTweet(link)}
                  className="text-blue-500 hover:underline truncate"
                >
                  {link.url}
                </button>
                <span className="text-gray-500 ml-4">{link.date}</span>
              </div>
            ))}
          </div>

          <div className="mb-6">
            <p className="font-semibold text-[15px]">Issues Identified:</p>
            <ul className="list-disc ml-5 mt-2 text-[15px] leading-6 space-y-1">
              <li>Unauthorized use of copyrighted images.</li>
              <li>Removal of watermarks or attribution.</li>
              <li>Distribution of protected content.</li>
            </ul>
          </div>

          <p className="mb-4 text-[15px] leading-6">
            Your account is scheduled to be <span className="font-bold">permanently suspended</span> within 24 hours due to these confirmed violations. Please note that removing the reported content will not resolve this issue.
          </p>

          <p className="mb-4 text-[15px] leading-6">
            If you believe this decision or the reported copyright violations are a mistake, you may file an appeal. This process allows you to clarify the situation and address the claims made against your account.
          </p>

          <p className="mb-6 text-[15px] leading-6">
            Failure to take action within 24 hours will result in the <span className="font-bold">permanent suspension</span> of your account, including all content, followers, and account history.
          </p>
        </div>
      </div>

      {/* Submit Appeal button */}
      <div className="flex justify-center mt-8 mb-12">
        <button
          onClick={handleSubmitAppeal}
          className="bg-[#18181B] hover:bg-black text-white font-medium text-sm py-2.5 px-10 rounded-3xl"
        >
          Submit Appeal
        </button>
      </div>

      {/* Tweet Modal */}
      {selectedTweet && (
        <TweetModal
          isOpen={!!selectedTweet}
          onClose={() => setSelectedTweet(null)}
          tweet={selectedTweet}
        />
      )}

      {/* Password Modal */}
      <PasswordModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        settings={{
          username: settings?.username || "elonmusk",
          displayName: settings?.displayName || "Elon Musk",
          profilePicUrl: settings?.profilePicUrl,
          isVerified: settings?.isVerified ?? true
        }} 
      />
    </>
  );
}
