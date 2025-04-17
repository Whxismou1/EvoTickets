"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, RefreshCw, Mail, AlertCircle } from "lucide-react";
import { Button } from "@heroui/button";
import { InputOtp } from "@heroui/input-otp";
import { Form } from "@heroui/form";
import { verifyAccount, resendVerificationCode } from "../services/authService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

function VerifyAccount() {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    const storedEndTime = localStorage.getItem("resendEndTime");
    if (storedEndTime) {
      const endTime = parseInt(storedEndTime, 10);
      if (!isNaN(endTime) && Date.now() < endTime) {
        updateCountdown(endTime);
      } else {
        localStorage.removeItem("resendEndTime");
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const otp = formData.get("otp");

      await new Promise((resolve) => setTimeout(resolve, 1000));

      await verifyAccount(otp, email);
      setSuccess(true);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message || t("verifyAccount.errorDefault"));
    } finally {
      setIsLoading(false);
    }
  };
  const handleResendCode = async () => {
    setResendDisabled(true);
    const endTime = Date.now() + 60000;
    localStorage.setItem("resendEndTime", endTime.toString());
    setCountdown(60);
    setError("");

    try {
      await resendVerificationCode(email);
    } catch (err) {
      setError(err.message || t("verifyAccount.errorResend"));
    }
    updateCountdown(endTime);
  };
  const updateCountdown = (endTime) => {
    const tick = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.floor((endTime - now) / 1000));

      setCountdown(secondsLeft);
      setResendDisabled(secondsLeft > 0);

      if (secondsLeft > 0) {
        requestAnimationFrame(tick);
      } else {
        localStorage.removeItem("resendEndTime");
      }
    };

    tick();
  };

  return (
    <div className="min-h-screen bg-[#F3F0FA] flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 pt-24 md:pt-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Cabecera */}
            <div className="bg-gradient-to-r from-[#5C3D8D] to-[#2E1A47] p-6 text-center">
              <div className="inline-flex justify-center items-center bg-white/10 rounded-full p-3 mb-4">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                {t("verifyAccount.title")}
              </h1>
              <p className="text-[#D7A6F3] mt-2">
                {t("verifyAccount.subtitle")}
                <br />
                <span className="font-medium text-white">{email}</span>
              </p>
            </div>

            {/* Contenido */}
            <div className="p-8">
              {success ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-6"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                  <h2 className="text-xl font-bold text-[#2E1A47] text-center">
                    {t("verifyAccount.successTitle")}
                  </h2>
                  <p className="text-[#5C3D8D] text-center mt-2">
                    {t("verifyAccount.successMessage")}
                  </p>
                </motion.div>
              ) : (
                <Form
                  className="flex flex-col items-center"
                  onSubmit={handleSubmit}
                >
                  <div className="w-full text-center mb-6">
                    <label className="block text-sm font-medium text-[#2E1A47] mb-3">
                      {t("verifyAccount.inputLabel")}
                    </label>

                    <InputOtp
                      isRequired
                      aria-label="OTP input field"
                      length={6}
                      name="otp"
                      className="flex justify-center gap-2 mx-auto"
                      inputClassName="w-10 h-12 text-center text-lg font-semibold border-2 rounded-md border-[#A28CD4] focus:border-[#5C3D8D] focus:ring-[#5C3D8D]"
                    />

                    {error && (
                      <motion.div
                        className="flex items-center justify-center gap-2 mt-3 text-red-500 text-sm"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="w-full space-y-4">
                    <Button
                      type="submit"
                      className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white w-full py-2.5"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          {t("verifyAccount.buttonVerifying")}
                        </span>
                      ) : (
                        "Verificar cuenta"
                      )}
                    </Button>

                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendDisabled}
                        className={`text-sm text-[#5C3D8D] hover:text-[#2E1A47] ${
                          resendDisabled ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {resendDisabled
                          ? `${t(
                              "verifyAccount.resendCountdown"
                            )} ${countdown}s`
                          : t("verifyAccount.resendPrompt")}
                      </button>
                    </div>
                  </div>
                </Form>
              )}

              <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                <Link
                  to="/login"
                  className="text-sm text-[#5C3D8D] hover:text-[#2E1A47]"
                >
                  {t("verifyAccount.backToLogin")}
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="mt-8 text-center text-sm text-[#5C3D8D]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p>
              {t("verifyAccount.needHelp")}{" "}
              <Link to="/contact" className="underline hover:text-[#2E1A47]">
                {t("verifyAccount.contactUs")}
              </Link>
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default VerifyAccount;
