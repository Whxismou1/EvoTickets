"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Ticket, ArrowRight, CheckCircle, AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"
import { forgotPassword } from "../services/authService"

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setIsError(false)
    setErrorMessage("")

    try {
      await forgotPassword(email)
      setIsSubmitted(true)
    } catch (error) {
      setIsError(true)
      setErrorMessage(error.message || t("forgotPassword.defaultError"))
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsError(false)
    setErrorMessage("")
  }

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
            {isError ? (
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#2E1A47] mb-2">
                  {t("forgotPassword.errorTitle", "Ha ocurrido un error")}
                </h2>
                <p className="text-[#5C3D8D] mb-6">
                  {errorMessage ||
                    t(
                      "forgotPassword.defaultError",
                      "No se pudo enviar el correo de recuperación. Por favor, inténtalo de nuevo.",
                    )}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={resetForm}>
                    {t("forgotPassword.tryAgain", "Intentar de nuevo")}
                  </Button>
                  <Button variant="outline" className="border-[#A28CD4] text-[#5C3D8D] hover:bg-[#A28CD4]/10">
                    <Link to="/login">{t("forgotPassword.backToLogin", "Volver al inicio de sesión")}</Link>
                  </Button>
                </div>
              </motion.div>
            ) : !isSubmitted ? (
              <>
                <div className="flex flex-col items-center mb-6">
                  <Ticket className="h-12 w-12 text-[#5C3D8D] mb-2" />
                  <h1 className="text-2xl font-bold text-[#2E1A47]">{t("forgotPassword.title")}</h1>
                  <p className="text-[#5C3D8D] text-center mt-2">{t("forgotPassword.description")}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-[#2E1A47]">
                      {t("forgotPassword.emailLabel")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("forgotPassword.placeholder")}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? t("forgotPassword.button.loading") : t("forgotPassword.button.send")}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <Link
                    to="/login"
                    className="text-sm text-[#5C3D8D] hover:text-[#2E1A47] transition-colors flex items-center justify-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    {t("forgotPassword.backToLogin")}
                  </Link>
                </div>
              </>
            ) : (
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#2E1A47] mb-2">{t("forgotPassword.successTitle")}</h2>
                <p className="text-[#5C3D8D] mb-6">{t("forgotPassword.successMessage", { email })}</p>
                <p className="text-sm text-[#5C3D8D] mb-6">{t("forgotPassword.checkSpam")}</p>
                <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                  <Link to="/login" className="text-white">
                    {t("forgotPassword.backToLogin")}
                  </Link>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  )
}