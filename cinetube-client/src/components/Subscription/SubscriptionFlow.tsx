"use client";

import { createCheckout, verifySubscriptionOtp } from "@/service/subscriptionService";
import { useState, useTransition } from "react";
// import { createCheckout, verifySubscriptionOtp } from "@/app/actions/subscriptionService"; // আপনার ফাইলের পাথ

export default function SubscriptionFlow() {
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<"checkout" | "otp">("checkout");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  // ১. চেকআউট হ্যান্ডলার
  const handleCheckout = () => {
    startTransition(async () => {
      try {
        const res = await createCheckout({ planType: "MONTHLY", amount: 99 });
        if (res.success) {
          setStep("otp");
          setMessage("Payment initiated! Please check your email for the OTP.");
        }
      } catch (err: any) {
        setMessage(err.message);
      }
    });
  };

  // ২. ওটিপি ভেরিফিকেশন হ্যান্ডলার
  const handleVerify = () => {
    startTransition(async () => {
      try {
        const res = await verifySubscriptionOtp(otp);
        if (res.success) {
          setMessage("Subscription activated successfully!");
        }
      } catch (err: any) {
        setMessage(err.message);
      }
    });
  };

  return (
    <div className="p-6 border rounded-lg max-w-md mx-auto">
      {message && <p className="mb-4 text-sm text-blue-600">{message}</p>}

      {step === "checkout" ? (
        <button
          onClick={handleCheckout}
          disabled={isPending}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {isPending ? "Processing..." : "Subscribe for $99"}
        </button>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={handleVerify}
            disabled={isPending}
            className="bg-green-500 text-white px-4 py-2 rounded w-full"
          >
            {isPending ? "Verifying..." : "Verify & Activate"}
          </button>
        </div>
      )}
    </div>
  );
}