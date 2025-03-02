"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Lock } from "lucide-react";
import axios from "../commons/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle2, XCircle } from "lucide-react";

const donationAmounts = [
  { value: 5, label: "$5" },
  { value: 10, label: "$10" },
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
];

const frequencies = [
  { value: "weekly", label: "Toddobaadle" },
  { value: "monthly", label: "Bil kasta" },
  { value: "quarterly", label: "Saddexdii bilood" },
  { value: "annually", label: "Sanadle" },
];

// Add these interfaces at the top of the file
interface DistrictOption {
  district_id: number;
  district: string;
  regionid?: number;
}

interface ApiResponse {
  data: DistrictOption[];
}

export default function DonateForm() {
  const [donationType, setDonationType] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [selectedAmount, setSelectedAmount] = useState<number | "other">(50);
  const [customAmount, setCustomAmount] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [frequency, setFrequency] = useState("weekly");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [stateOptions, setStateOptions] = useState<
    { stateid: number; state: string }[]
  >([]);
  const [districtOptions, setDistrictOptions] = useState<ApiResponse>({
    data: [],
  });
  const [selectedState, setSelectedState] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Add state for payment method
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Calculate next payment date when component mounts
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("/state");
        setStateOptions(response.data.data);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    const memberDataStr = localStorage.getItem("memberData");
    const stateId = localStorage.getItem("state_id");
    const districtId = localStorage.getItem("district_id");

    if (memberDataStr) {
      setIsLoggedIn(true);
      const memberData = JSON.parse(memberDataStr);
      setFirstName(memberData.first_name || "");
      setLastName(memberData.last_name || "");
      setEmail(memberData.email || "");
      setPhoneNumber(memberData.mobile || "");
    }

    // Set state and fetch districts if state_id exists
    if (stateId) {
      const stateIdNum = parseInt(stateId);
      setSelectedState(stateIdNum);
      fetchDistrictsByState(stateIdNum);
    }

    // Set district if district_id exists
    if (districtId) {
      setSelectedDistrict(parseInt(districtId));
    }
  }, []);

  const fetchDistrictsByState = async (stateId: number) => {
    try {
      const response = await axios.get(`/district/districtByState/${stateId}`);
      setDistrictOptions({ data: response.data.data });
      console.log("Districts fetched:", response.data.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDonation = async () => {
    setIsProcessing(true);
    const amount = selectedAmount === "other" ? customAmount : selectedAmount;

    if (!phoneNumber || !amount) {
      setErrorMessage("Fadlan geli lambarka taleefanka iyo qadarka");
      setShowErrorModal(true);
      setIsProcessing(false);
      return;
    }

    try {
      const response = await axios.get("members/payment/requestPayment", {
        params: {
          phone: phoneNumber,
          amount: amount,
        },
      });

      if (response.data.success) {
        setShowSuccessModal(true);
      } else {
        setErrorMessage(response.data.message);
        setShowErrorModal(true);
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Nidaamka lacag bixinta wuu fashilmay"
      );
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const SuccessModal = () => (
    <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="w-6 h-6" />
            Lacag Bixinta Waa Guul
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-600">
            Waad ku mahadsan tahay deeqdaada qiimaha leh! waxaad heli doontaa
            SMS xaqiijin ah dhowaan.
          </p>
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="bg-green-600 hover:bg-green-700"
          >
            Xir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const ErrorModal = () => (
    <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <XCircle className="w-6 h-6" />
            Lacag Bixinta Waa Fashilantay
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-600">{errorMessage}</p>
          <Button
            onClick={() => setShowErrorModal(false)}
            className="bg-red-600 hover:bg-red-700"
          >
            Xir
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="space-y-8">
        {/* Donation Type */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Deeq Bixinta Qadarka</h2>
          <p className="mb-4">
            Ama ka hel{" "}
            <Link
              href="/donor-clubs"
              className="text-secondary hover:underline"
            >
              Naadiyada Deeq-bixiyayaasha
            </Link>
            .
          </p>
          <div className="flex gap-2 mb-6">
            <Button
              variant={donationType === "one-time" ? "default" : "outline"}
              onClick={() => setDonationType("one-time")}
              className="flex-1"
            >
              Deeq hal mar ah
            </Button>
            <Button
              variant={donationType === "recurring" ? "default" : "outline"}
              onClick={() => setDonationType("recurring")}
              className="flex-1"
            >
              Deeq joogto ah
            </Button>
          </div>
        </div>

        {/* Recurring Options */}
        {donationType === "recurring" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Geedi socodka hadiyadeyda</Label>
              <Select defaultValue={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Xulo joogitaanka" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextPayment">Lacag bixinta xigta ee</Label>
              <Input
                type="text"
                id="nextPayment"
                value={nextPaymentDate || formattedDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                placeholder="MM/DD/YYYY"
              />
              <p className="text-sm text-gray-500">
                Isticmaal qaabka MM/DD/YYYY
              </p>
              <p className="text-sm text-gray-500">
                Hadiyaddaada koowaad waxay maanta socotaa. Hadiyadda xigta waxay
                socotaa on {formattedDate}.
              </p>
            </div>
          </div>
        )}

        {/* Amount Selection */}
        <div className="grid grid-cols-6 gap-2">
          {donationAmounts.map(({ value, label }) => (
            <Button
              key={value}
              variant={selectedAmount === value ? "default" : "outline"}
              onClick={() => setSelectedAmount(value)}
              className="col-span-1"
            >
              {label}
            </Button>
          ))}
          <Button
            variant={selectedAmount === "other" ? "default" : "outline"}
            onClick={() => setSelectedAmount("other")}
            className="col-span-2"
          >
            Qadar kale
          </Button>
        </div>

        {selectedAmount === "other" && (
          <div className="space-y-2">
            <Label htmlFor="customAmount">Geli Qadarka</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">
                $
              </span>
              <Input
                id="customAmount"
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        )}
        {/* Phone Number */}
        <div className="space-y-2">
          <Label>Telefon</Label>
          <Input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0700 123 456"
          />
        </div>
        <div className="space-y-2">
          <Button
            onClick={handleDonation}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <div className="spinner"></div>
            ) : (
              <span>Deeq Bixinta</span>
            )}
          </Button>
        </div>
      </div>

      <SuccessModal />
      <ErrorModal />
    </div>
  );
}
