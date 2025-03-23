import React from "react";

interface FooterColumnProps {
  title: string;
  links: { text: string; href: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col">
      <h3 className="font-medium text-xs mb-4 text-gray-400">{title}</h3>
      <ul className="space-y-3">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="text-xs text-gray-400 hover:underline"
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const platformLinks = [
    { text: "X.com", href: "#" },
    { text: "Status", href: "#" },
    { text: "Accessibility", href: "#" },
    { text: "Embed a post", href: "#" },
    { text: "Privacy Center", href: "#" },
    { text: "Transparency Center", href: "#" },
    { text: "Download the X app", href: "#" },
  ];

  const corporateLinks = [
    { text: "About the company", href: "#" },
    { text: "Company news", href: "#" },
    { text: "Brand toolkit", href: "#" },
    { text: "Jobs and internships", href: "#" },
    { text: "Investors", href: "#" },
  ];

  const helpLinks = [
    { text: "Help Center", href: "#" },
    { text: "Using X", href: "#" },
    { text: "X for creators", href: "#" },
    { text: "Ads Help Center", href: "#" },
    { text: "Managing your account", href: "#" },
    { text: "Email Preference Center", href: "#" },
    { text: "Rules and policies", href: "#" },
    { text: "Contact us", href: "#" },
  ];

  const developerLinks = [
    { text: "Developer home", href: "#" },
    { text: "Documentation", href: "#" },
    { text: "Forums", href: "#" },
    { text: "Communities", href: "#" },
    { text: "Developer blog", href: "#" },
    { text: "Engineering blog", href: "#" },
    { text: "Developer terms", href: "#" },
  ];

  const businessLinks = [
    { text: "Advertise", href: "#" },
    { text: "X for business", href: "#" },
    { text: "Resources and guides", href: "#" },
    { text: "X for marketers", href: "#" },
    { text: "Marketing insights", href: "#" },
    { text: "Brand inspiration", href: "#" },
    { text: "X Ads Academy", href: "#" },
  ];

  return (
    <footer className="w-full bg-[#0f1419] text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <FooterColumn title="X Platform" links={platformLinks} />
          <FooterColumn title="X Corp." links={corporateLinks} />
          <FooterColumn title="Help" links={helpLinks} />
          <FooterColumn title="Developer resources" links={developerLinks} />
          <FooterColumn title="Business resources" links={businessLinks} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-12 pt-6 border-t border-gray-800 text-xs text-gray-500">
          <div className="mb-4 md:mb-0">© 2025 X Corp.</div>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:underline">Cookies</a>
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms and conditions</a>
            <div className="cursor-pointer">English</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
