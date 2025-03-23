"use client";

import Header from "./Header";
import ProgressSteps from "./ProgressSteps";
import ActionNeededContent from "./ActionNeededContent";
import Footer from "./Footer";
import BackToTop from "./BackToTop";

interface XHelpCenterPageProps {
  settings?: {
    username: string;
    displayName: string;
    profilePicUrl: string;
    isVerified: boolean;
    tweetLinks: string[];
  };
}

export default function XHelpCenterPage({ settings }: XHelpCenterPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header settings={settings} />
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 py-8 md:py-12">
        <div className="w-full max-w-4xl">
          <ProgressSteps />
          <h1 className="text-2xl font-semibold mt-10 mb-8 text-center">Action Needed</h1>
          <ActionNeededContent settings={settings} />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
