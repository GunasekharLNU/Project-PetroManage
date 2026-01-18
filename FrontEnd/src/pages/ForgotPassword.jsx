import React, { useState } from "react";

export function ForgotPassword({
  title = "Forgot password",
  subtitle = "Enter your email to receive reset instructions",
  loginHref = "/login",
  signupHref = "/register",
  onGoToLogin,
}) {
  const [role, setRole] = useState("manager"); 
  const [stage, setStage] = useState("REQUEST"); // REQUEST | VERIFY
  const [enableOtpFlow] = useState(true); 

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const showMsg = (type, text) => setMessage({ type, text });
  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleRequest = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email || !validateEmail(email)) {
      return showMsg("error", "Please enter a valid email address.");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (enableOtpFlow) {
        setStage("VERIFY");
        showMsg("success", `Verification code sent to ${email}.`);
      } else {
        showMsg("success", `Reset link sent to ${email}.`);
      }
    }, 800);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!otp || otp.length < 4) {
      return showMsg("error", "Enter the verification code.");
    }
    if (!newPw || newPw.length < 6) {
      return showMsg("error", "Password must be at least 6 characters.");
    }
    if (newPw !== confirmPw) {
      return showMsg("error", "Passwords do not match.");
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showMsg("success", "Password reset successfully.");
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center bg-[#F9FAFB] px-6 py-10 text-black justify-center font-sans">
      <div
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 lg:p-10"
        role="region"
        aria-label="Forgot password form"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-black tracking-tight text-black">{title}</h2>
          <p className="text-gray-500 mt-2 font-medium">{subtitle}</p>
        </div>

        {/* Role switch */}
        <div className="mb-6">
          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setRole("manager")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "manager" ? "bg-black text-white shadow-md" : "text-gray-500 hover:text-black"
              }`}
            >
              Manager
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                role === "admin" ? "bg-black text-white shadow-md" : "text-gray-500 hover:text-black"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Status message */}
        {message.text && (
          <div
            className={`mb-6 rounded-xl px-4 py-3 text-sm font-semibold border ${
              message.type === "error" ? "border-red-200 bg-red-50 text-red-600" : "border-orange-200 bg-orange-50 text-orange-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Stage: REQUEST */}
        {stage === "REQUEST" && (
          <form className="space-y-6" onSubmit={handleRequest} noValidate>
            <div>
              <label htmlFor="fp-email" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                Email Address
              </label>
              <input
                id="fp-email"
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-4 outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 px-4 py-4 text-sm font-black text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 active:scale-[0.97] transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </form>
        )}

        {/* Stage: VERIFY */}
        {stage === "VERIFY" && (
          <form className="space-y-5" onSubmit={handleVerify} noValidate>
            <div>
              <label htmlFor="fp-otp" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                OTP Code
              </label>
              <input
                id="fp-otp"
                type="text"
                placeholder="123456"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all text-center tracking-[10px] font-bold text-xl"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                required
              />
            </div>
            <div>
              <label htmlFor="fp-new" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                New Password
              </label>
              <input
                id="fp-new"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="fp-confirm" className="text-[11px] font-black uppercase tracking-[1.5px] text-gray-400 mb-2 block ml-1">
                Confirm Password
              </label>
              <input
                id="fp-confirm"
                type="password"
                placeholder="••••••••"
                className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50 text-black placeholder:text-gray-400 px-5 py-3.5 outline-none focus:border-orange-500 focus:bg-white transition-all"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-orange-500 px-4 py-4 text-sm font-black text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:bg-orange-600 active:scale-[0.97] transition-all disabled:opacity-50 uppercase tracking-widest"
            >
              {loading ? "Resetting..." : "Update Password"}
            </button>
          </form>
        )}

        {/* Footer Actions */}
        <div className="mt-8 text-center text-sm font-medium text-gray-500 space-y-3">
          <div>
            Remembered your password?
            <button
              type="button"
              onClick={onGoToLogin || (() => window.location.href = loginHref)}
              className="ml-2 font-black text-black hover:text-orange-600 transition-colors border-b-2 border-black hover:border-orange-600"
            >
              Sign in
            </button>
          </div>
          <div>
            Don’t have an account?
            <a href={signupHref} className="ml-2 font-black text-black hover:text-orange-600 transition-colors border-b-2 border-black hover:border-orange-600">
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}