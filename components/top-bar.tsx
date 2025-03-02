
import {
  Menu,
  X,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function TopBar() {
  return (
    <div
      className=" text-white  py-3 px-4 text-xs sm:text-sm"
      style={{
        background: "linear-gradient(135deg, #2E8B57, #4CAF50)",
      }}
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-2 sm:mb-0">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <a href="mailto:info@Xisbigaupd.com">
              <span>info@Xisbigaupd.com</span>
            </a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-center sm:text-left">Mogadishu,Somalia.</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center space-x-4">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e6f5ee] transition-colors"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e6f5ee] transition-colors"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e6f5ee] transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e6f5ee] transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
