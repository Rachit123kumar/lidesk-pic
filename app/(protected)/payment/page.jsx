"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/SIdeBar";
import {
  CreditCard,
  Check,
  Loader2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from "lucide-react";

export default function PaymentPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingPlan, setBuyingPlan] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // -----------------------------
  // Fetch Plans
  // -----------------------------
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/plans");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to fetch plans");
        }

        setPlans(data.plans || []);
      } catch (error) {
        console.error("Fetch plans error:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load plans. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // -----------------------------
  // Load Razorpay Checkout
  // -----------------------------
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(true));
        existingScript.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // -----------------------------
  // Verify Payment
  // -----------------------------
  const verifyPayment = async (paymentResponse) => {
    try {
      const response = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Payment verification failed");
      }

      return data;
    } catch (error) {
      console.error("Payment verification error:", error);
      throw error;
    }
  };

  // -----------------------------
  // Buy Plan
  // -----------------------------
  const handleBuy = async (planId) => {
    try {
      setBuyingPlan(planId);
      setError("");
      setSuccess("");

      const razorpayLoaded = await loadRazorpay();

      if (!razorpayLoaded) {
        throw new Error("Unable to load Razorpay Checkout. Please try again.");
      }

      const response = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Unable to create payment order");
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Libdesk",
        description: `${data.plan.name} - ${data.plan.coins} AI Coins`,
        order_id: data.orderId,
        prefill: {
          name: data.user?.name || "",
          email: data.user?.email || "",
        },
        notes: {
          paymentId: data.paymentId,
          planId: data.plan.id,
        },
        theme: {
          color: "#4F46E5", // Premium Indigo color to match new design
        },
        handler: async function (paymentResponse) {
          try {
            setError("");
            setSuccess("Payment received. Verifying your transaction...");

            const verificationResult = await verifyPayment(paymentResponse);

            setSuccess(
              verificationResult.message ||
                "Payment successful! Your coins have been added."
            );
            
            // Note: window.location.reload() has been removed to allow the success screen to show
          } catch (error) {
            setSuccess("");
            setError(
              error instanceof Error
                ? error.message
                : "Payment was received but verification failed. Please check your balance."
            );
          } finally {
            setBuyingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setBuyingPlan(null);
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        setError(
          response.error?.description || "Payment failed. Please try again."
        );
        setSuccess("");
        setBuyingPlan(null);
      });

      razorpay.open();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setSuccess("");
      setBuyingPlan(null);
    }
  };

  // -----------------------------
  // Format Price
  // -----------------------------
  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  // Helper to determine if we are currently in the verification stage
  const isVerifying = success.toLowerCase().includes("verifying");

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto pt-20 lg:pt-10 p-5 md:p-8 relative">
        <div className="max-w-6xl mx-auto pb-20 h-full">
          
          {/* -----------------------------
              BIG SUCCESS SCREEN
          ----------------------------- */}
          {success && (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] max-w-lg mx-auto text-center animate-in fade-in zoom-in duration-500">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-sm ${isVerifying ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                {isVerifying ? (
                  <Loader2 size={48} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={48} />
                )}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {isVerifying ? "Verifying Payment..." : "Payment Successful!"}
              </h2>
              <p className="text-slate-500 text-lg mb-8">{success}</p>
              
              {!isVerifying && (
                <Link
                  href="/credits"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                  View Payment History <ArrowRight size={18} />
                </Link>
              )}
            </div>
          )}

          {/* -----------------------------
              BIG ERROR SCREEN
          ----------------------------- */}
          {!success && error && (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] max-w-lg mx-auto text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <XCircle size={48} />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900">
                Payment Failed
              </h2>
              <p className="text-slate-500 text-lg mb-8">{error}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
                <button
                  onClick={() => setError("")}
                  className="px-8 py-4 rounded-xl font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
                >
                  Try Again
                </button>
                <Link
                  href="/credits"
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                >
                  View History <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          )}

          {/* -----------------------------
              PRICING TABLE (Hidden if Success or Error)
          ----------------------------- */}
          {!success && !error && (
            <>
              {/* Header */}
              <div className="text-center mb-16 mt-8">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full mb-6 border border-indigo-100 shadow-sm">
                  <Sparkles size={16} className="text-indigo-600" />
                  <span className="font-semibold text-sm tracking-wide uppercase">
                    Upgrade Your Workspace
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                  Choose Your Power Plan
                </h1>

                <p className="mt-5 text-slate-500 font-medium text-lg max-w-xl mx-auto">
                  Get more AI headshot generations and unlock premium capabilities to scale your account.
                </p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 size={40} className="animate-spin text-indigo-600" />
                  <p className="font-medium text-slate-500">
                    Loading premium plans...
                  </p>
                </div>
              )}

              {/* Pricing Cards Grid */}
              {!loading && plans.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                  {plans.map((plan, index) => {
                    const isPopular = index === 1;

                    return (
                      <div
                        key={plan.id}
                        className={`relative flex flex-col bg-white rounded-3xl p-8 transition-all duration-300 ${
                          isPopular
                            ? "border-2 border-indigo-500 shadow-xl lg:-translate-y-4"
                            : "border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1"
                        }`}
                      >
                        {/* Popular Badge */}
                        {isPopular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-md">
                            Most Popular
                          </div>
                        )}

                        {/* Plan Header */}
                        <div className="mb-6">
                          <h2 className="text-2xl font-bold text-slate-900">
                            {plan.name}
                          </h2>
                          <p className="text-slate-500 mt-2 min-h-[48px] text-sm leading-relaxed">
                            {plan.description}
                          </p>
                        </div>

                        {/* Price Section */}
                        <div className="mb-6 flex items-baseline gap-1">
                          <span className="text-5xl font-extrabold text-slate-900 tracking-tight">
                            {formatPrice(plan.price, plan.currency)}
                          </span>
                        </div>

                        {/* Coins Display block */}
                        <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-center border border-slate-100 flex flex-col items-center justify-center group-hover:bg-indigo-50/50 transition-colors">
                          <div className="text-3xl font-bold text-slate-900 mb-1">
                            {plan.coins}
                          </div>
                          <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                            AI Coins Included
                          </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 flex-1 mb-8">
                          <div className="flex items-start gap-3 text-slate-700">
                            <div className="bg-indigo-100 rounded-full p-1 mt-0.5 shrink-0">
                              <Check size={14} className="text-indigo-600" strokeWidth={3} />
                            </div>
                            <span className="text-sm font-medium">{plan.coins} High-res AI generations</span>
                          </div>

                          {plan.canDownload && (
                            <div className="flex items-start gap-3 text-slate-700">
                              <div className="bg-indigo-100 rounded-full p-1 mt-0.5 shrink-0">
                                <Check size={14} className="text-indigo-600" strokeWidth={3} />
                              </div>
                              <span className="text-sm font-medium">Download generated images</span>
                            </div>
                          )}

                          {plan.customRatio && (
                            <div className="flex items-start gap-3 text-slate-700">
                              <div className="bg-indigo-100 rounded-full p-1 mt-0.5 shrink-0">
                                <Check size={14} className="text-indigo-600" strokeWidth={3} />
                              </div>
                              <span className="text-sm font-medium">Custom aspect ratio controls</span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleBuy(plan.id)}
                          disabled={buyingPlan !== null}
                          className={`w-full py-4 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                            isPopular
                              ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                              : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md"
                          } disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]`}
                        >
                          {buyingPlan === plan.id ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CreditCard size={18} />
                              Secure Checkout
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Empty State */}
              {!loading && plans.length === 0 && (
                <div className="text-center py-20 px-6 max-w-md mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <p className="font-bold text-xl text-slate-900">
                    No plans available
                  </p>
                  <p className="text-slate-500 mt-2 text-sm">
                    Please check back later or contact support to top up your account.
                  </p>
                </div>
              )}

              {/* Footer Trust Badge */}
              {!loading && plans.length > 0 && (
                <div className="mt-16 flex items-center justify-center gap-2 text-sm text-slate-400">
                  <ShieldCheck size={18} />
                  <span>Encrypted & secure payments powered by Razorpay</span>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}