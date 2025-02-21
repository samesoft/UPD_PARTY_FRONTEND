import React, { useState, useRef } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import axios from '../commons/axios';
import { useRouter } from 'next/navigation';

const CreateAccount: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState<string>('');
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Explicitly type the ref to hold HTMLInputElement or null
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Handle phone submission: send OTP to the provided phone number.
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      setError("Fadlan geli nambarka taleefanka Soomaali ee saxda ah.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const formattedPhone = phone.startsWith('+252') ? phone : `+252${phone}`;
      const response = await axios.post('/members/requestOtp', {
        phoneNumber: formattedPhone
      });

      if (response.data.success) {
        setStep('otp');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Fariinta OTP ayaa ku guuldareysatay in la diro. Fadlan isku day mar kale."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP change for a given index.
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    // Allow only a single digit (or empty)
    if (!/^\d?$/.test(value)) return;
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    // If a digit was entered and it's not the last field, move focus to the next field.
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  // Allow moving back on backspace when the field is empty.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Handle OTP submission: validate the entered OTP.
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      setError("Fadlan geli 6-lambar oo OTP ah.");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const cleanedPhone = phone.startsWith('+252') ? phone.slice(4) : phone;
      const response = await axios.post('/members/verify-otp', {
        phoneNumber: cleanedPhone,
        otp
      });

      if (response.data.success) {
        localStorage.setItem('phone', cleanedPhone);
        router.push('/user-membership');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Ku guuldareysatay in la xaqiijiyo OTP."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 via-green-50 to-white">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Logo or Brand Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
              Ku soo dhowow Xisbiga Midowga Nabadda & Horumarka
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ku biir bulshadaheena adoo abuuraya akoonkaaga.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Progress Steps */}
            <div className="bg-green-50 px-8 py-4 border-b border-green-100">
              <div className="flex items-center justify-center space-x-4">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "phone"
                        ? "bg-green-600 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    1
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-700">
                    Taleefan Lambarka
                  </div>
                </div>
                <div className="w-16 h-0.5 bg-green-200"></div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step === "otp" ? "bg-green-600 text-white" : "bg-gray-200"
                    }`}
                  >
                    2
                  </div>
                  <div className="ml-2 text-sm font-medium text-gray-700">
                    Hubinta
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8 md:p-12">
              <div className="max-w-md mx-auto">
                <div className="mb-10 text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    {step === "phone"
                      ? "Geli Lambarkaaga Taleefanka"
                      : "Xaqiiji Lambarkaaga"}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {step === "phone"
                      ? "Waxaan ku soo diraynaa koodh xaqiijin ah si aad u bilowdo."
                      : `Waxaan kuu soo dirnay koodh 6-lambar ah ee ${phone}`}
                  </p>
                </div>

                {step === "phone" ? (
                  <form onSubmit={handlePhoneSubmit} className="space-y-8">
                    <div className="relative">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Taleefan Lambarka
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <span className="text-gray-500 text-lg font-medium">
                            +252
                          </span>
                        </div>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                          }
                          placeholder="61 234 5678"
                          className="w-full pl-20 pr-4 py-4 text-lg border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                          maxLength={9}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <p className="text-red-700">{error}</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-green-600 text-white text-lg font-medium rounded-xl hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isLoading ? (
                        <CircularProgress size={28} color="inherit" />
                      ) : (
                        "Send Verification Code"
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleOtpSubmit} className="space-y-8">
                    <div>
                      <label className="block text-gray-700 text-sm font-medium mb-4">
                        Geli Koodhka Hubinta
                      </label>
                      <div className="flex justify-between space-x-3">
                        {otpValues.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            ref={(el) => {
                              inputsRef.current[index] = el;
                            }}
                            className="w-14 h-16 text-center text-2xl font-bold border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all"
                            maxLength={1}
                          />
                        ))}
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                        <p className="text-red-700">{error}</p>
                      </div>
                    )}

                    <div className="space-y-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-green-600 text-white text-lg font-medium rounded-xl hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {isLoading ? (
                          <CircularProgress size={28} color="inherit" />
                        ) : (
                          "Verify Code"
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep("phone")}
                        className="w-full py-4 bg-white text-green-600 text-lg font-medium border-2 border-green-200 rounded-xl hover:bg-green-50 focus:ring-4 focus:ring-green-200 transition-all"
                      >
                        Ku laabo Lambarka Taleefanka
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Footer Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              "U ubaahan tahay caawimaad? La xiriir kooxdayada taageerada.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CreateAccount;
