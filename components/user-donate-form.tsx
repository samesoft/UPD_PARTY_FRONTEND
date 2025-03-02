"use client";

import { useState, useEffect, useCallback } from "react";
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
import type { IMember } from "@/types/member";

const donationAmounts = [
  { value: 5, label: "$5" },
  { value: 10, label: "$10" },
  { value: 25, label: "$25" },
  { value: 50, label: "$50" },
  { value: 100, label: "$100" },
];

const frequencies = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
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

  const fetchDistrictsByState = useCallback(async (stateId: number) => {
    try {
      console.log(`Fetching districts for state ID: ${stateId}`);
      const response = await axios.get(`/district/districtByState/${stateId}`);
      if (response.data && response.data.data) {
        setDistrictOptions({ data: response.data.data });
        console.log("Districts fetched:", response.data.data);
      } else {
        console.warn("No district data found in response:", response.data);
        setDistrictOptions({ data: [] });
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistrictOptions({ data: [] });
    }
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get("/state");
        setStateOptions(response.data.data);

        // If we have a selectedState but no district options yet, fetch districts
        // if (selectedState && districtOptions.data.length === 0) {
        //   fetchDistrictsByState(selectedState)
        // }
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    // Only fetch districts if we have a valid state ID
    if (selectedState && selectedState > 0) {
      fetchDistrictsByState(selectedState);
    }
  }, [selectedState, fetchDistrictsByState]);

  // Add fallback data fetching if memberData is incomplete
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        // Check if we need to fetch data (missing or incomplete memberData)
        if (!memberData || !memberData.first_name || !memberData.last_name) {
          // You can replace this with your actual member ID or identifier
          const memberId =
            localStorage.getItem("memberId") ||
            sessionStorage.getItem("memberId");

          if (memberId) {
            const response = await axios.get(`/members/${memberId}`);
            if (response.data.success) {
              const fetchedMember = response.data.data;

              // Update all form fields with fetched data
              setNames({
                firstName: fetchedMember.first_name || "",
                lastName: fetchedMember.last_name || "",
                middleName: fetchedMember.middle_name || "",
              });

              setPhoneNumber(fetchedMember.mobile || "");

              if (fetchedMember.state_id) {
                setSelectedState(fetchedMember.state_id);
                // District will be fetched by the other useEffect that watches selectedState
              }

              if (fetchedMember.district_id) {
                setSelectedDistrict(fetchedMember.district_id.toString());
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, [memberData]);

  const handleDonation = async () => {
    setIsProcessing(true);
    const amount = selectedAmount === "other" ? customAmount : selectedAmount;

    if (!phoneNumber || !amount) {
      setErrorMessage("Please provide both phone number and amount");
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
        error?.response?.data?.message || "Payment processing failed"
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
            Payment Successful
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-600">
            Thank you for your generous donation! You will receive an SMS
            confirmation shortly.
          </p>
          <Button
            onClick={() => setShowSuccessModal(false)}
            className="bg-green-600 hover:bg-green-700"
          >
            Close
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
            Payment Failed
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 text-center space-y-4">
          <p className="text-gray-600">{errorMessage}</p>
          <Button
            onClick={() => setShowErrorModal(false)}
            className="bg-red-600 hover:bg-red-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  const handleRefreshData = async () => {
    try {
      setIsProcessing(true);

      // Clear current form data
      setNames({ firstName: "", lastName: "", middleName: "" });
      setPhoneNumber("");
      setSelectedState(null);
      setSelectedDistrict("");

      // Fetch fresh data
      const memberId =
        localStorage.getItem("memberId") || sessionStorage.getItem("memberId");
      if (memberId) {
        const response = await axios.get(`/members/${memberId}`);
        if (response.data.success) {
          const fetchedMember = response.data.data;

          setNames({
            firstName: fetchedMember.first_name || "",
            lastName: fetchedMember.last_name || "",
            middleName: fetchedMember.middle_name || "",
          });

          setPhoneNumber(fetchedMember.mobile || "");

          if (fetchedMember.state_id) {
            setSelectedState(fetchedMember.state_id);
          }

          if (fetchedMember.district_id) {
            setSelectedDistrict(fetchedMember.district_id.toString());
          }
        }
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      setErrorMessage("Failed to refresh user data");
      setShowErrorModal(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={handleRefreshData}
          disabled={isProcessing}
          className="text-sm"
        >
          {isProcessing ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>
      <div className="space-y-8">
        {/* Donation Type */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Donate any amount</h2>

          <div className="flex gap-2 mb-6">
            <Button
              variant={donationType === "one-time" ? "default" : "outline"}
              onClick={() => setDonationType("one-time")}
              className="flex-1"
            >
              One-time donation
            </Button>
            <Button
              variant={donationType === "recurring" ? "default" : "outline"}
              onClick={() => setDonationType("recurring")}
              className="flex-1"
            >
              Recurring donation
            </Button>
          </div>
        </div>

        {/* Recurring Options */}
        {donationType === "recurring" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Process my gift</Label>
              <Select defaultValue={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
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
              <Label htmlFor="nextPayment">Next payment on</Label>
              <Input
                type="text"
                id="nextPayment"
                value={nextPaymentDate || formattedDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                placeholder="MM/DD/YYYY"
              />
              <p className="text-sm text-gray-500">Use the format MM/DD/YYYY</p>
              <p className="text-sm text-gray-500">
                Your first gift processes today. The next gift processes on{" "}
                {formattedDate}.
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
            Other amount
          </Button>
        </div>

        {selectedAmount === "other" && (
          <div className="space-y-2">
            <Label htmlFor="customAmount">Enter amount</Label>
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
          <h3 className="text-xl font-semibold">Your information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={names.firstName}
                disabled={isProcessing}
                onChange={(e) =>
                  setNames((prev) => {
                    return { ...prev, firstName: e.target.value };
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Middle name</Label>
              <Input
                id="lastName"
                value={names.middleName}
                disabled={isProcessing}
                onChange={(e) =>
                  setNames((prev) => {
                    return { ...prev, lastName: e.target.value };
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={names.lastName}
                disabled={isProcessing}
                onChange={(e) =>
                  setNames((prev) => {
                    return { ...prev, lastName: e.target.value };
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              disabled={isProcessing}
              className="w-full h-10 px-3 border rounded-md"
              onChange={(e) => {
                const stateId = Number(e.target.value);
                setSelectedState(stateId);
                // if (stateId) {
                //   fetchDistrictsByState(stateId);
                // }
              }}
              value={selectedState || ""}
            >
              <option value="">Select State</option>
              {stateOptions.map((option) => (
                <option key={option.stateid} value={option.stateid}>
                  {option.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Privacy Policy */}
        <p className="text-sm text-gray-600">
          To learn how we collect and use your information, please read our{" "}
          <Link
            href="/privacy-policy"
            className="text-secondary hover:underline"
          >
            privacy policy
          </Link>
          .
        </p>
        {/* Add Payment Method Selection */}
        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method</Label>
          <select
            id="paymentMethod"
            className="w-full h-10 px-3 border rounded-md"
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            value={selectedPaymentMethod}
          >
            <option value="">Select Payment Method</option>
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
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., 615123456"
            className="pl-8"
          />
          <p className="text-sm text-gray-500">
            Enter number without country code (e.g., 61000000)
          </p>
        </div>

        {/* Update Payment Button */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Payment</h3>
          <Button
            className="w-full h-12 bg-primary hover:bg-primary/90 relative"
            onClick={handleDonation}
            disabled={isProcessing}
          >
            <Lock className="w-4 h-4 mr-2" />
            {isProcessing ? (
              <>
                <span className="animate-pulse">Processing...</span>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              </>
            ) : (
              "Donate"
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
