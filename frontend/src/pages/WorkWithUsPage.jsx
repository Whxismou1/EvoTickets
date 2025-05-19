"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@heroui/button"
import { Input } from "@heroui/input"
import { Briefcase, Upload } from "lucide-react"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"

export default function WorkWithUsPage() {
  const { t } = useTranslation()
  const { alert, showAlert, hideAlert } = useAlert()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    resume: null,
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showAlert({
          type: "error",
          message: t("workWithUs.fileSizeError"),
        })
        return
      }
      setFormData((prev) => ({
        ...prev,
        resume: file,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.message) {
      showAlert({
        type: "error",
        message: t("workWithUs.requiredFieldsError"),
      })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showAlert({
        type: "error",
        message: t("workWithUs.invalidEmailError"),
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await sendWorkApplication(formData)

      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor")
      }

      showAlert({
        type: "success",
        message: t("workWithUs.successMessage"),
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        resume: null,
      })

      const fileInput = document.getElementById("resume")
      if (fileInput) fileInput.value = ""

    } catch (error) {

      console.error("Error al enviar el formulario:", error)
      showAlert({
        type: "error",
        message: t("workWithUs.submitError"),
      })

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Nav />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-[calc(100vh-128px)] py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-[#A28CD4]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center mb-8 text-center">
              <Briefcase className="h-12 w-12 text-[#5C3D8D] mb-2" />
              <h1 className="text-3xl font-bold text-[#2E1A47] mb-2">{t("workWithUs.title")}</h1>
              <p className="text-[#5C3D8D] max-w-2xl">
                {t("workWithUs.description")}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-[#2E1A47]">
                    {t("workWithUs.form.fullNameLabel")}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                    placeholder={t("workWithUs.form.fullNamePlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#2E1A47]">
                    {t("workWithUs.form.emailLabel")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                    placeholder={t("workWithUs.form.emailPlaceholder")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-[#2E1A47]">
                  {t("workWithUs.form.phoneLabel")}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border-[#A28CD4] focus:ring-[#5C3D8D]"
                  placeholder={t("workWithUs.form.phonePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-[#2E1A47]">
                  {t("workWithUs.form.motivationLabel")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-[#A28CD4] focus:ring-[#5C3D8D] focus:border-[#5C3D8D] p-3 text-sm"
                  placeholder={t("workWithUs.form.motivationPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="resume" className="text-sm font-medium text-[#2E1A47]">
                  {t("workWithUs.form.resumeLabel")}
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="resume"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-[#A28CD4]/40 bg-[#F3F0FA]/30 hover:bg-[#F3F0FA]/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-[#5C3D8D]" />
                      <p className="mb-1 text-sm text-[#5C3D8D]">
                        <span className="font-medium">{t("workWithUs.form.uploadText")}</span> {t("workWithUs.form.orDragText")}
                      </p>
                      <p className="text-xs text-[#5C3D8D]/70">
                        {formData.resume ? formData.resume.name : t("workWithUs.form.resumePlaceholder")}
                      </p>
                    </div>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      {t("workWithUs.form.sendingText")}
                    </span>
                  ) : (
                    t("workWithUs.form.submitText")
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-[#5C3D8D]/70 pt-2">
                {t("workWithUs.privacy.text")}{" "}
                <a href="/privacy" className="underline hover:text-[#2E1A47]">
                  {t("workWithUs.privacy.policy")}
                </a>{" "}
                y{" "}
                <a href="/terms" className="underline hover:text-[#2E1A47]">
                  {t("workWithUs.privacy.terms")}
                </a>
                .
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  )
}