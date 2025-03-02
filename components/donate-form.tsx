"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  { value: "weekly", label: "Toddobaadlaha" },
  { value: "monthly", label: "Bishiiba" },
  { value: "quarterly", label: "Saddexdii biloodba" },
  { value: "annually", label: "Sanadkiiba" },
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
      const stateIdNum = Number.parseInt(stateId);
      setSelectedState(stateIdNum);
      fetchDistrictsByState(stateIdNum);
    }

    // Set district if district_id exists
    if (districtId) {
      setSelectedDistrict(Number.parseInt(districtId));
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
      setErrorMessage("Fadlan gali lambarka taleefanka iyo lacagta");
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
        error?.response?.data?.message || "Lacag bixintu way fashilantay"
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
            Lacag bixintu waa la aqbalay
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-600">
            Waad ku mahadsan tahay tabarucaaga deeqsinimada leh! Waxaad dhawaan
            heli doontaa xaqiijin SMS ah.
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
            Lacag bixintu way fashilantay
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
          <h2 className="text-2xl font-bold mb-2">Ku deeq lacag kasta</h2>
          
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
              <Label>Habka lacag bixinta</Label>
              <Select defaultValue={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Dooro joogtaynta" />
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
              <Label htmlFor="nextPayment">Lacag bixinta xigta</Label>
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
                Deeqda koowaad waxay dhacaysaa maanta. Deeqda xigta waxay
                dhacaysaa {formattedDate}.
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
            Lacag kale
          </Button>
        </div>

        {selectedAmount === "other" && (
          <div className="space-y-2">
            <Label htmlFor="customAmount">Gali lacagta</Label>
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

        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Macluumaadkaaga</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Magaca koowaad</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoggedIn}
                className={isLoggedIn ? "bg-gray-100" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Magaca dambe</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoggedIn}
                className={isLoggedIn ? "bg-gray-100" : ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email-ka</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Gali iimaylkaaga"
              disabled={isLoggedIn && email !== ""}
              className={isLoggedIn && email !== "" ? "bg-gray-100" : ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Gobolka</Label>
            <select
              id="state"
              className="w-full h-10 px-3 border rounded-md"
              onChange={(e) => {
                const stateId = Number(e.target.value);
                setSelectedState(stateId);
                if (stateId) {
                  fetchDistrictsByState(stateId);
                }
                setSelectedDistrict(null);
              }}
              value={selectedState || ""}
              disabled={isLoggedIn}
            >
              <option value="">Dooro Gobolka</option>
              {stateOptions.map((option) => (
                <option key={option.stateid} value={option.stateid}>
                  {option.state}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="district">Degmada</Label>
            <select
              id="district"
              className="w-full h-10 px-3 border rounded-md"
              onChange={(e) => {
                setSelectedDistrict(Number(e.target.value));
              }}
              value={selectedDistrict || ""}
              disabled={isLoggedIn}
            >
              <option value="">Dooro Degmada</option>
              {districtOptions.data?.map((option) => (
                <option key={option.district_id} value={option.district_id}>
                  {option.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Privacy Policy */}
        <p className="text-sm text-gray-600">
          Si aad u ogaato sida aan u ururino oo aan u isticmaalno
          macluumaadkaaga, fadlan akhri{" "}
          <Link
            href="/privacy-policy"
            className="text-secondary hover:underline"
          >
            xeerka asturnaanta
          </Link>
          .
        </p>
        {/* Add Payment Method Selection */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Habka Lacag bixinta</Label>
          <select
            id="paymentMethod"
            className="w-full h-10 px-3 border rounded-md"
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            value={selectedPaymentMethod}
          >
            <option value="">Dooro Habka Lacag bixinta</option>
            {/* Add your payment method options here */}
            <option value="mpesa">EVC-Plus</option>
            <option value="paypal">E-Dahab</option>
            <option value="paypal">Premier Wallet </option>
            <option value="paypal">Zaad Service</option>
            <option value="paypal">SAHAL Wallet </option>
          </select>
        </div>

        {/* Add Phone Number Field */}
        <div className="space-y-2">
          <Label htmlFor="phone">Lambarka Taleefanka</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="tusaale, 615123456"
            className="pl-8"
          />
          <p className="text-sm text-gray-500">
            Gali lambarka iyada oo aan lahayn furaha wadanka (tusaale,
            615123456)
          </p>
        </div>

        {/* Update Payment Button */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Lacag bixinta</h3>
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 relative"
            onClick={handleDonation}
            disabled={isProcessing}
          >
            <Lock className="w-4 h-4 mr-2" />
            {isProcessing ? (
              <>
                <span className="animate-pulse">Waa la hawlgalinayaa...</span>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              "Ku deeq"
            )}
          </Button>
        </div>

        {/* Add Modals */}
        <SuccessModal />
        <ErrorModal />
      </div>
    </div>
  );
}
