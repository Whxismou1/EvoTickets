"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@heroui/button"
import { Link } from "react-router-dom"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"
import { useTranslation } from "react-i18next"

export default function PrivacyPolicyPage() {
  const { alert, showAlert, hideAlert } = useAlert()
  const { t } = useTranslation(); 

  const section1_1List = t('privacyPolicy.section1_1List', { returnObjects: true });
  const section1_2List = t('privacyPolicy.section1_2List', { returnObjects: true });
  const section2List = t('privacyPolicy.section2List', { returnObjects: true });
  const section3List = t('privacyPolicy.section3List', { returnObjects: true });
  const section4List = t('privacyPolicy.section4List', { returnObjects: true });
  const section6List = t('privacyPolicy.section6List', { returnObjects: true });
  const contactInfo = [ 
                        { label: t("privacyPolicy.section9List.0"), value: "privacy@evotickets.com" },
                        { label: t("privacyPolicy.section9List.1"), value: "+34 900 123 456" },
                        { label: t("privacyPolicy.section9List.2"), value: "Calle Gran Vía, 28, 28013 Madrid, España" }
                      ]


  return (
    <>
      <Nav />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-screen bg-[#F9F7FD] pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-[#5C3D8D] hover:text-[#2E1A47] transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("privacyPolicy.backToHome")}
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-[#2E1A47] mb-6">{t("privacyPolicy.title")}</h1>
            <p className="text-[#5C3D8D] mb-6">{t("privacyPolicy.lastUpdated")}</p>

            <div className="prose prose-purple max-w-none text-[#5C3D8D]">
              <p>
                {t("privacyPolicy.intro1")}
              </p>

              <p>
                {t("privacyPolicy.intro2")}
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">{t("privacyPolicy.section1Title")}</h2>

              <h3 className="text-lg font-medium text-[#2E1A47] mt-6 mb-3">{t("privacyPolicy.section1_1Title")}</h3>
              <p>{t("privacyPolicy.section1_1Desc")}</p>
              <ul className="list-disc pl-6 mb-4">
                {section1_1List.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h3 className="text-lg font-medium text-[#2E1A47] mt-6 mb-3">{t("privacyPolicy.section1_2Title")}</h3>
              <p>{t("privacyPolicy.section1_2Desc")}</p>
              <ul className="list-disc pl-6 mb-4">
                {section1_2List.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">{t("privacyPolicy.section2Title")}</h2>
              <p>{t("privacyPolicy.section2Desc")}</p>
              <ul className="list-disc pl-6 mb-4">
                {section2List.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">
                {t("privacyPolicy.section3Title")}
              </h2>
              <p>
                {t("privacyPolicy.section3_1")}
              </p>

              <p>
                {t("privacyPolicy.section3_2")}
              </p>

              <p>{t("privacyPolicy.section3_3")}</p>
              <ul className="list-disc pl-6 mb-4">
                {section3List.map((item, index) => {
                  const [title, description] = item.split(":");
                  return (
                    <li key={index}>
                      <strong>{title.trim()}:</strong>
                      {description && <> {description.trim()}</>}
                    </li>
                  );
                })}
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">{t("privacyPolicy.section4Title")}</h2>
              <p>{t("privacyPolicy.section4Desc")}</p>
              <ul className="list-disc pl-6 mb-4">
               {section4List.map((item, index) => {
                  const [title, description] = item.split(":");
                  return (
                    <li key={index}>
                      <strong>{title.trim()}:</strong>
                      {description && <> {description.trim()}</>}
                    </li>
                  );
                })}
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">{t("privacyPolicy.section5Title")}</h2>
              <p>
                {t("privacyPolicy.section5Desc")}
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">{t("privacyPolicy.section6Title")}</h2>
              <p>
                {t("privacyPolicy.section6_1")}
              </p>

              <p>
                {t("privacyPolicy.section6_2")}
              </p>

              <p>{t("privacyPolicy.section6_3")}</p>
              <ul className="list-disc pl-6 mb-4">
                {section6List.map((item, index) => {
                  const [title, description] = item.split(":");
                  return (
                    <li key={index}>
                      <strong>{title.trim()}:</strong>
                      {description && <> {description.trim()}</>}
                    </li>
                  );
                })}
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">{t("privacyPolicy.section7Title")}</h2>
              <p>
                {t("privacyPolicy.section7_1")}
              </p>

              <p>
                {t("privacyPolicy.section7_2")}
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">
                {t("privacyPolicy.section8Title")}
              </h2>
              <p>
                {t("privacyPolicy.section8_1")}
              </p>

              <p>
                {t("privacyPolicy.section8_2")}
              </p>

              <p>
                {t("privacyPolicy.section8_3")}
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">{t("privacyPolicy.section9Title")}</h2>
              <p>{t("privacyPolicy.section9_1")}</p>
              <ul className="list-disc pl-6 mb-4">
                {contactInfo.map((item, index) => (
                  <li key={index}>
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#A28CD4]/20">
              <Button onClick={() => window.history.back()} className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
