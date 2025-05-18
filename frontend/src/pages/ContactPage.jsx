"use client";

import { useState } from "react";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import Nav from "../components/Navbar";
import Footer from "../components/Footer";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sendContactEmail } from "../services/contactService";

export default function ContactPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showAlert({
        type: "error",
        message: t("contact.alert.required"),
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log(formData)
      await sendContactEmail(formData); 

      showAlert({
        type: "success",
        message: t("contact.alert.success"),
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.log(error);
      showAlert({
        type: "error",
        message: t("contac.alert.error"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Nav />
      <Alert
        type={alert.type}
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
      />

      <div className="min-h-screen bg-[#F9F7FD] pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-[#2E1A47] mb-4">
              {t("contact.title")}
            </h1>
            <p className="text-[#5C3D8D] max-w-2xl mx-auto">
              {t("contact.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="bg-white rounded-xl shadow-md p-6 h-med">
                <h2 className="text-xl font-semibold text-[#2E1A47] mb-6">
                  {t("contact.info.title")}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#F3F0FA] p-3 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-[#5C3D8D]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">
                        {t("contact.info.phone")}
                      </h3>
                      <p className="text-[#5C3D8D]">+34 900 123 456</p>
                      <p className="text-sm text-[#5C3D8D]/70">
                        {t("contact.info.hours")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#F3F0FA] p-3 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-[#5C3D8D]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">
                        {t("contact.info.email")}
                      </h3>
                      <p className="text-[#5C3D8D]">s.evotickets@gmail.com</p>
                      <p className="text-sm text-[#5C3D8D]/70">
                        {t("contact.info.response")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#F3F0FA] p-3 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-[#5C3D8D]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#2E1A47]">
                        {t("contact.info.address")}
                      </h3>
                      <p className="text-[#5C3D8D]">Calle Gran Vía, 28</p>
                      <p className="text-[#5C3D8D]">28013 Madrid, España</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-[#2E1A47] mb-6">
                  {t("contact.form.title")}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-[#2E1A47] mb-1">
                        {t("contact.form.name")} <span className="text-red-500">*</span>
                      </label>
                      <Input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#2E1A47] mb-1">
                        {t("contact.form.email")} <span className="text-red-500">*</span>
                      </label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-[#2E1A47] mb-1">
                      {t("contact.form.subject")}
                    </label>
                    <Input id="subject" name="subject" type="text" value={formData.subject} onChange={handleChange} />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-[#2E1A47] mb-1">
                      {t("contact.form.message")} <span className="text-red-500">*</span>
                    </label>
                    <textarea id="message" name="message" rows="6" value={formData.message} onChange={handleChange} required />
                  </div>

                  <div className="flex items-center">
                    <input id="privacy" type="checkbox" required />
                    <label htmlFor="privacy" className="ml-2 block text-sm text-[#5C3D8D]">
                      {t("contact.form.privacy")}{" "}
                      <span onClick={() => navigate("/PrivacyPolicyPage")} className="cursor-pointer underline hover:text-[#2E1A47]">
                        {t("contact.form.privacyLink")}
                      </span>
                    </label>
                  </div>

                  <div>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="flex items-center">🔄 {t("contact.form.sending")}</span>
                      ) : (
                        <span className="flex items-center"><Send className="h-4 w-4 mr-2" />{t("contact.form.submit")}</span>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

