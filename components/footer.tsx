import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import SignUpBanner from "./sign-up-banner";

const mainNavLinks = [
  { name: "Conference", href: "/campaign" },
  { name: "News", href: "/news" },
  { name: "Campaign", href: "/campaign" },
  { name: "Join", href: "/join" },
  { name: "Sign Up", href: "/sign-up" },
  { name: "Donate", href: "/donate" },
];

// const footerColumns = [
//   {
//     links: [
//       { name: "Register to Vote", href: "#" },
//       { name: "Renew your Membership", href: "#" },
//       { name: "Party Organisation", href: "#" },
//       { name: "Equal Opportunities", href: "#" },
//       { name: "Young Members", href: "#" },
//     ],
//   },
//   {
//     links: [
//       { name: "Women", href: "#" },
//       { name: "Shop", href: "#" },
//       { name: "Lottery", href: "#" },
//       { name: "Policy Forum", href: "#" },
//       { name: "Transparency", href: "#" },
//     ],
//   },
//   {
//     links: [
//       { name: "Member Governance", href: "#" },
//       { name: "Safeguarding", href: "#" },
//       { name: "Privacy Notice", href: "#" },
//       { name: "Terms of Use", href: "#" },
//       { name: "Cookies", href: "#" },
//     ],
//   },
//   {
//     links: [
//       { name: "Parliamentary Diversity Data", href: "#" },
//       { name: "Gender Pay Statistics", href: "#" },
//       { name: "Work for Us", href: "#" },
//       { name: "Contact Us", href: "#" },
//       { name: "Old Site", href: "#" },
//     ],
//   },
// ];

const socialLinks = [
  {
    name: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/UPDParty",
  },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-white">
      <SignUpBanner />

      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center space-x-6 mb-12">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className="hover:text-secondary transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <social.icon className="h-6 w-6" />
              <span className="sr-only">{social.name}</span>
            </a>
          ))}
        </div>

        <div className="flex justify-center mb-12">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/UPD-LOGO.jpg-NTcieqWTeByAfsGeFnFFxWNJvDAVrJ.jpeg"
            alt="Party Logo"
            width={200}
            height={60}
            className="h-12 w-auto"
          />
        </div>

        <nav className="mb-12">
          <ul className="flex flex-wrap justify-center gap-6">
            {mainNavLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-secondary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerColumns.map((column, columnIndex) => (
            <ul key={columnIndex} className="space-y-2">
              {column.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div> */}
        {/* <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 py-6 pl-8  ">
          {footerColumns.map((column, columnIndex) => (
            <ul key={columnIndex} className="space-y-4">
              {column.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-secondary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
        </div> */}

        <div className="text-center text-sm space-y-2 pt-4">
          <p>© 2025 The Party.</p>
          <p>Promoted by Party UPD at, Mogadishu, Somalia.</p>
        </div>
      </div>
    </footer>
  );
}
