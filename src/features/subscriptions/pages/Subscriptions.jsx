import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getSubscriptionPlans,
  getCurrentSubscription,
  initiatePayPalPayment,
  initiateAirtelMoneyPayment,
  verifyAirtelMoneyPayment,
  getPaymentHistory,
  cancelSubscription,
} from "../services/subscriptionsService";
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  Check,
  X,
  ArrowLeft,
  Loader2,
  ReceiptText,
  BadgeCheck,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalizeData = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.result)) return data.result;
  if (Array.isArray(data.data)) return data.data;
  return [];
};

const formatDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? String(value)
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};

const StatusPill = ({ status }) => {
  const s = (status || "").toLowerCase();
  const styles = s.includes("active") || s === "paid"
    ? "bg-[#e8f5ee] text-[#145c37]"
    : s.includes("cancel") || s.includes("inactive")
    ? "bg-red-50 text-red-700"
    : s.includes("pending")
    ? "bg-amber-50 text-amber-700"
    : "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
};

// ─── Plan card ────────────────────────────────────────────────────────────────

function PlanCard({ plan, onChoose }) {
  const features = Array.isArray(plan.features)
    ? plan.features
    : plan.features
    ? [plan.features]
    : [];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-[#1a7a4a] transition-colors duration-150">
      <div className="bg-[#1a7a4a] px-5 py-5">
        <h3 className="text-base font-semibold text-white mb-1">{plan.name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold text-white">${plan.price}</span>
          <span className="text-sm text-white/70">/month</span>
        </div>
        {plan.description && (
          <p className="text-xs text-[#9fd9ba] mt-2">{plan.description}</p>
        )}
      </div>
      <div className="px-5 py-4">
        {features.length > 0 && (
          <ul className="space-y-2 mb-4">
            {features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <Check className="w-4 h-4 text-[#1a7a4a] flex-shrink-0 mt-0.5" />
                {f}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={() => onChoose(plan)}
          className="w-full bg-[#1a7a4a] hover:bg-[#145c37] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors duration-150"
        >
          Choose plan
        </button>
      </div>
    </div>
  );
}

// ─── Payment modal ────────────────────────────────────────────────────────────

function PaymentModal({ plan, onClose, onPayPal, onAirtel, processing }) {
  const [method, setMethod] = useState("paypal");
  const [phone, setPhone] = useState("");

  const handlePay = () => {
    if (method === "paypal") {
      onPayPal();
    } else {
      if (!phone.trim()) return toast.error("Enter your Airtel Money number");
      onAirtel(phone);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Complete payment</h2>
            <p className="text-xs text-gray-400 mt-0.5">Select a payment method to continue</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors mt-0.5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">

          {/* Plan summary */}
          <div className="bg-[#f6fcf9] border border-[#c8e9d8] rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3b7a5c]">Selected plan</p>
              <p className="text-sm font-semibold text-[#145c37] mt-0.5">{plan.name}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-semibold text-[#1a7a4a]">${plan.price}</p>
              <p className="text-xs text-[#3b7a5c]">per month</p>
            </div>
          </div>

          {/* Method selection */}
          <div className="flex flex-col gap-2">
            {/* PayPal */}
            <div
              onClick={() => setMethod("paypal")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer border transition-all duration-150
                ${method === "paypal" ? "border-[#1a7a4a] border-[1.5px] bg-[#f6fcf9]" : "border-gray-200 hover:border-[#1a7a4a]"}`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#003087] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">PP</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">PayPal</p>
                <p className="text-xs text-gray-400">Redirect to PayPal checkout</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all
                ${method === "paypal" ? "bg-[#1a7a4a] border-[#1a7a4a]" : "border-gray-300"}`}>
                {method === "paypal" && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
              </div>
            </div>

            {/* Airtel */}
            <div
              onClick={() => setMethod("airtel")}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer border transition-all duration-150
                ${method === "airtel" ? "border-[#1a7a4a] border-[1.5px] bg-[#f6fcf9]" : "border-gray-200 hover:border-[#1a7a4a]"}`}
            >
              <div className="w-8 h-8 rounded-lg bg-[#e40000] flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">AM</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Airtel Money</p>
                <p className="text-xs text-gray-400">Pay via mobile money</p>
              </div>
              <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center flex-shrink-0 transition-all
                ${method === "airtel" ? "bg-[#1a7a4a] border-[#1a7a4a]" : "border-gray-300"}`}>
                {method === "airtel" && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
              </div>
            </div>
          </div>

          {/* PayPal info */}
          {method === "paypal" && (
            <div className="flex items-start gap-2 bg-gray-50 rounded-xl px-3 py-2.5 text-xs text-gray-500 leading-relaxed">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1a7a4a] flex-shrink-0 mt-0.5" />
              You'll be redirected to PayPal to complete payment securely. No card details are stored here.
            </div>
          )}

          {/* Airtel phone input */}
          {method === "airtel" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400">Airtel Money number</label>
              <div className="flex">
                <span className="px-3 py-2.5 border border-r-0 border-gray-200 rounded-l-xl text-sm bg-gray-100 text-gray-500 whitespace-nowrap">
                  +265
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="099 123 4567"
                  className="flex-1 border border-gray-200 rounded-r-xl px-3 py-2.5 text-sm text-gray-900 bg-gray-50 focus:outline-none focus:border-[#1a7a4a] transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePay}
            disabled={processing}
            className={`flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed
              ${method === "paypal" ? "bg-[#003087] hover:opacity-90" : "bg-[#e40000] hover:opacity-90"}`}
          >
            {processing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : method === "paypal" ? (
              <CreditCard className="w-4 h-4" />
            ) : (
              <Smartphone className="w-4 h-4" />
            )}
            {processing
              ? "Processing…"
              : method === "paypal"
              ? "Continue to PayPal"
              : "Pay with Airtel Money"}
          </button>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pb-4">
          <ShieldCheck className="w-3 h-3 text-[#1a7a4a]" />
          256-bit SSL encrypted and secure
        </p>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const TABS = [
  { key: "plans", label: "Available plans" },
  { key: "current", label: "Current subscription" },
  { key: "history", label: "Payment history" },
];

export default function Subscriptions() {
  const [activeTab, setActiveTab] = useState("plans");
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansData, subData, historyData] = await Promise.all([
        getSubscriptionPlans(),
        getCurrentSubscription(),
        getPaymentHistory(),
      ]);
      setPlans(normalizeData(plansData));
      setCurrentSubscription(subData);
      setPaymentHistory(normalizeData(historyData));
    } catch {
      toast.error("Failed to load subscription data");
    } finally {
      setLoading(false);
    }
  };

  const handlePayPal = async () => {
    if (!selectedPlan) return;
    setProcessing(true);
    try {
      const res = await initiatePayPalPayment(selectedPlan.id, selectedPlan.price);
      if (res?.approvalUrl) {
        window.open(res.approvalUrl, "_blank");
        toast.success("Redirecting to PayPal…");
        setSelectedPlan(null);
      } else {
        toast.error("Failed to initiate PayPal payment");
      }
    } catch (err) {
      toast.error(err?.message || "PayPal payment initiation failed");
    } finally {
      setProcessing(false);
    }
  };

  const handleAirtel = async (phone) => {
    if (!selectedPlan) return;
    setProcessing(true);
    try {
      const res = await initiateAirtelMoneyPayment(selectedPlan.id, selectedPlan.price, phone);
      if (res?.transactionId) {
        toast.success("Payment initiated — check your phone to complete.");
        setSelectedPlan(null);
        setTimeout(() => verifyAirtelPayment(res.transactionId), 60000);
      } else {
        toast.error("Failed to initiate Airtel Money payment");
      }
    } catch (err) {
      toast.error(err?.message || "Airtel Money initiation failed");
    } finally {
      setProcessing(false);
    }
  };

  const verifyAirtelPayment = async (transactionId) => {
    try {
      const res = await verifyAirtelMoneyPayment(transactionId);
      if (res?.status === "success") {
        toast.success("Payment verified successfully!");
        fetchData();
      }
    } catch {
      toast.error("Payment verification failed");
    }
  };

  const handleCancel = async () => {
    if (!currentSubscription?.id) return;
    if (!window.confirm("Are you sure you want to cancel your subscription?")) return;
    try {
      await cancelSubscription(currentSubscription.id);
      toast.success("Subscription cancelled");
      fetchData();
    } catch (err) {
      toast.error(err?.message || "Failed to cancel subscription");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#1a7a4a] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl font-semibold text-gray-900">Subscription plans</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your subscription and payment methods</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-7">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors duration-150 -mb-px
                ${activeTab === tab.key
                  ? "border-[#1a7a4a] text-[#1a7a4a]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Plans tab ── */}
        {activeTab === "plans" && (
          plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} onChoose={setSelectedPlan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <BadgeCheck className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No plans available</p>
            </div>
          )
        )}

        {/* ── Current subscription tab ── */}
        {activeTab === "current" && (
          currentSubscription ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {[
                  { label: "Plan name", value: currentSubscription.planName },
                  { label: "Status", value: <StatusPill status={currentSubscription.status} /> },
                  { label: "Monthly price", value: `$${currentSubscription.price}` },
                  { label: "Renewal date", value: formatDate(currentSubscription.renewalDate) },
                  { label: "Start date", value: formatDate(currentSubscription.startDate) },
                  { label: "Last payment", value: formatDate(currentSubscription.lastPaymentDate) },
                ].map((field, i) => (
                  <div key={i}>
                    <p className="text-xs text-gray-400 mb-1">{field.label}</p>
                    <p className="text-sm font-medium text-gray-900">{field.value}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-5">
                {currentSubscription.status?.toLowerCase() === "active" && (
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-medium transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    Cancel subscription
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm mb-4">No active subscription</p>
              <button
                onClick={() => setActiveTab("plans")}
                className="px-5 py-2 bg-[#1a7a4a] text-white text-sm font-medium rounded-xl hover:bg-[#145c37] transition-colors"
              >
                Browse plans
              </button>
            </div>
          )
        )}

        {/* ── Payment history tab ── */}
        {activeTab === "history" && (
          paymentHistory.length > 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["Date", "Plan", "Amount", "Method", "Status"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-700">{formatDate(p.date)}</td>
                      <td className="px-5 py-3.5 text-gray-700">{p.planName}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">${p.amount}</td>
                      <td className="px-5 py-3.5">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          {p.method?.toLowerCase() === "paypal"
                            ? <CreditCard className="w-3.5 h-3.5 text-[#003087]" />
                            : <Smartphone className="w-3.5 h-3.5 text-[#e40000]" />
                          }
                          {p.method}
                        </span>
                      </td>
                      <td className="px-5 py-3.5"><StatusPill status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <ReceiptText className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No payment history</p>
            </div>
          )
        )}
      </div>

      {/* Payment modal */}
      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onPayPal={handlePayPal}
          onAirtel={handleAirtel}
          processing={processing}
        />
      )}
    </div>
  );
}