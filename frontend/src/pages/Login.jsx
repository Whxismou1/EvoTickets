"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Ticket, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {signInWithGoogle} from "../config/firebase.config";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = email, 2 = password

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep(1);
  };

  return (
    <>
      <Nav />
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-md">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-[#A28CD4]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center mb-6">
              <Ticket className="h-12 w-12 text-[#5C3D8D] mb-2" />
              <h1 className="text-2xl font-bold text-[#2E1A47]">
                {t("loginPage.loginTitle")}
              </h1>
            </div>

            <form
              onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit}
              className="space-y-4"
            >
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div
                    key="email-step"
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-sm font-medium text-[#2E1A47]">
                      {t("loginPage.emailLabel")}
                    </p>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("loginPage.emailPlaceholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                    />
                    <motion.div>
                      <Button
                        type="submit"
                        className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                      >
                        {t("loginPage.continueWithEmail")}
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="password-step"
                    className="space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-2">
                      <Button
                        type="button"
                        variant="ghost"
                        className="p-0 h-auto text-[#5C3D8D] hover:bg-transparent hover:text-[#2E1A47]"
                        onClick={goBack}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#2E1A47]">
                        {t("loginPage.passwordLabel")}
                      </p>
                      <Input
                        id="password"
                        type="password"
                        placeholder={t("loginPage.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                        autoFocus
                      />
                    </div>

                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-sm text-[#5C3D8D] hover:text-[#2E1A47] transition-colors"
                      >
                        {t("loginPage.forgotPassword")}
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                      disabled={isLoading}
                    >
                      {isLoading
                        ? t("loginPage.loggingIn")
                        : t("loginPage.loginButton")}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#A28CD4]/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-[#5C3D8D]">
                    {t("loginPage.orContinueWith")}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={signInWithGoogle}
                className="w-full border-[#A28CD4] text-[#5C3D8D] hover:bg-[#A28CD4]/10 mb-4"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {t("loginPage.googleButton")}
              </Button>

              <p className="text-center text-sm text-[#5C3D8D]">
                {t("loginPage.noAccount")}{" "}
                <Link
                  to="/register"
                  className="font-medium text-[#5C3D8D] hover:text-[#2E1A47] transition-colors"
                >
                  {t("loginPage.registerLink")}
                </Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
