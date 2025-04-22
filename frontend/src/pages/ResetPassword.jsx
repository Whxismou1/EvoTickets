"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Ticket, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router-dom"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"

export default function ResetPassword() {
  const { t } = useTranslation()
  const { token } = useParams()
  const navigate = useNavigate()

  const [isValidToken, setIsValidToken] = useState(true)
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      if (!token || token === "invalid") {
        setIsValidToken(false)
        setError(t("resetPassword.errorInvalidLink"))
      }
    }
    verifyToken()
  }, [token, t])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword)
    } else if (field === "confirm") {
      setShowConfirmPassword(!showConfirmPassword)
    }
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("resetPassword.errorMismatch")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) return

    setIsLoading(true)
    try {
      await axios.post("/api/reset-password", {
        token,
        password: formData.password,
      })
      setIsSubmitted(true)
    } catch (error) {
      setError(error.response?.data?.messageKey || "resetPassword.errorGeneral")
    } finally {
      setIsLoading(false)
    }
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
            {!isValidToken ? (
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#2E1A47] mb-2">
                  {t("resetPassword.invalidLinkTitle")}
                </h2>
                <p className="text-[#5C3D8D] mb-6">
                  {error || t("resetPassword.errorInvalidLink")}
                </p>
                <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                  <Link to="/forgot-password" className="text-white">
                    {t("resetPassword.requestNewLink")}
                  </Link>
                </Button>
              </motion.div>
            ) : !isSubmitted ? (
              <>
                <div className="flex flex-col items-center mb-6">
                  <Ticket className="h-12 w-12 text-[#5C3D8D] mb-2" />
                  <h1 className="text-2xl font-bold text-[#2E1A47]">
                    {t("resetPassword.title")}
                  </h1>
                  <p className="text-[#5C3D8D] text-center mt-2">
                    {t("resetPassword.subtitle")}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-[#2E1A47]">
                      {t("resetPassword.newPassword")}
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder={t("resetPassword.passwordPlaceholder")}
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="border-[#A28CD4] focus:ring-[#5C3D8D] pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5C3D8D]"
                        onClick={() => togglePasswordVisibility("password")}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-[#5C3D8D]">{t("resetPassword.passwordHelp")}</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-[#2E1A47]">
                      {t("resetPassword.confirmPassword")}
                    </label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="border-[#A28CD4] focus:ring-[#5C3D8D] pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#5C3D8D]"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                      {t(error)}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? t("resetPassword.buttonLoading")
                      : t("resetPassword.buttonReset")}
                  </Button>
                </form>
              </>
            ) : (
              <motion.div
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-[#2E1A47] mb-2">
                  {t("resetPassword.successTitle")}
                </h2>
                <p className="text-[#5C3D8D] mb-6">
                  {t("resetPassword.successMessage")}
                </p>
                <Button
                  className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                  onClick={() => navigate("/login")}
                >
                  {t("resetPassword.loginButton")}
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