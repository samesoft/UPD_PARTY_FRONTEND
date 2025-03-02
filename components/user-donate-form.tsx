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
import { IMember } from "@/types/member";

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
  { value: "annually", label: "Sannadkiiba" },
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

export default function UserDonateForm({
  memberData,
}: {
  memberData: IMember;
}) {
  console.log(memberData);
  const [donationType, setDonationType] = useState<"one-time" | "recurring">(
    "one-time"
  );
  const [names, setNames] = useState({
    firstName: memberData?.first_name || "",
    lastName: memberData?.last_name || "",
    middleName: memberData?.middle_name || "",
  });
  const [selectedAmount, setSelectedAmount] = useState<number | "other">(50);
  const [customAmount, setCustomAmount] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [frequency, setFrequency] = useState("weekly");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(memberData?.mobile ?? "");
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
  const [selectedState, setSelectedState] = useState<number | null>(
    memberData?.state_id || null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    memberData?.district_id?.toString() || ""
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(""); // Add state for payment method
  console.log(selectedDistrict);
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
    if (selectedState) {
      fetchDistrictsByState(selectedState);
    }
  }, [selectedState]);

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
        error?.response?.data?.message || "Lacag bixintu waa ay guuldarreysatay."
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
            Waad ku mahadsan tahay tabarucaaga deeqsinimada leh! Waxaad dhowaan
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
            Lacag bixintu waa ay guuldarreysatay.
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
          <h2 className="text-2xl font-bold mb-2">Lacag Bixinta</h2>

          <div className="flex gap-2 mb-6">
            <Button
              variant={donationType === "one-time" ? "default" : "outline"}
              onClick={() => setDonationType("one-time")}
              className="flex-1"
            >
              Ku Deeq hal mar ah
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
                placeholder="BB/MM/SSSS"
              />
              <p className="text-sm text-gray-500">
                Isticmaal qaabka BB/MM/SSSS
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

        {/* Privacy Policy */}
        {/* <p className="text-sm text-gray-600">
          Si aad u ogaato sida aan u ururinno oo aan u isticmaalno
          macluumaadkaaga, fadlan akhri{" "}
          <Link
            href="/privacy-policy"
            className="text-secondary hover:underline"
          >
            xeerka asturnaanta
          </Link>
          .
        </p> */}
        {/* Add Payment Method Selection */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Habka Lacag bixinta</Label>
          <select
            id="paymentMethod"
            className="w-full h-10 px-3 border rounded-md"
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            value={selectedPaymentMethod}
          >
            
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
            placeholder="tusaale, +252XXXXXXXXX"
            className="pl-8"
          />
          <p className="text-sm text-gray-500">
            Gali lambarka iyada oo aan lahayn furaha dalka (tusaale,
            +252XXXXXXXXX)
          </p>
        </div>

        {/* Update Payment Button */}
        <div>
         
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 relative"
            onClick={handleDonation}
            disabled={isProcessing}
          >
            <Lock className="w-4 h-4 mr-2" />
            {isProcessing ? (
              <>
                <span className="animate-pulse">Waa la hawlgalayaa...</span>
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
