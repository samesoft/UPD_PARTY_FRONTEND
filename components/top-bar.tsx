import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function TopBar() {
  return (
    <div className="bg-[#2E8B57] text-white py-2 px-4 text-xs sm:text-sm">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-2 sm:mb-0">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            <span>1-888-452-1505</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>updparty@gmail.com</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Mon - Sat: 8 am - 5 pm</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="text-center sm:text-left">
              58 Sd Street Road, Mogadishu, Somalia
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
