"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function TermsPage() {
  const { t } = useTranslation()
  const { alert, showAlert, hideAlert } = useAlert()

  const section2List = t('termsPage.section2List', { returnObjects: true });
  const section4List = t('termsPage.section4List', { returnObjects: true });
  const section5List = t('termsPage.section5List', { returnObjects: true });
  const section7List = t('termsPage.section7List', { returnObjects: true });
  const section10List = t('termsPage.section10Contact', { returnObjects: true });

  return (
    <>
      <Nav />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-[calc(100vh-128px)] mt-16 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-[#A28CD4]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-[#5C3D8D] hover:text-[#2E1A47] transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("termsPage.backToHome")}
              </Link>
            </div>
            
            <div className="flex flex-col items-center mb-8 text-center">
              <FileText className="h-12 w-12 text-[#5C3D8D] mb-2" />
              <h1 className="text-3xl font-bold text-[#2E1A47] mb-2">{t("termsPage.title")}</h1>
              <p className="text-[#5C3D8D] max-w-2xl">{t("termsPage.lastUpdated")}</p>
            </div>

            <div className="space-y-6 text-[#2E1A47]/80">
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section1Title")}</h2>
                <p>
                  {t("termsPage.section1Text")}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">2. Definiciones</h2>
                {section2List.map((item, index) => {
                  const [title, description] = item.split(":");
                  return (
                    <p key={index}>
                      <strong>{title.trim()}:</strong>
                      {description && <> {description.trim()}</>}
                    </p>
                  );
                })}
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section3Title")}</h2>
                <p>
                  {t("termsPage.section3Text1")}
                </p>
                <p>
                  {t("termsPage.section3Text2")}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section4Title")}</h2>
                <p>{t("termsPage.section4Intro")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {section4List.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section5Title")}</h2>
                <p>{t("termsPage.section5Intro")}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {section5List.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
                </ul>
                <p>
                  {t("termsPage.section5Note")}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section6Title")}</h2>
                <p>
                  {t("termsPage.section6Text1")}
                </p>
                <p>
                  {t("termsPage.section6Text2")}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section7Title")}</h2>
                <p>
                  {t("termsPage.section7Text")}
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  {section7List.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section8Title")}</h2>
                <p>
                  {t("termsPage.section8Text1")}
                </p>
                <p>
                  {t("termsPage.section8Text2")}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section9Title")}</h2>
                <p>
                  {t("termsPage.section9Text1")}
                </p>
                <p>
                  {t("termsPage.section9Text2")}
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">{t("termsPage.section10Title")}</h2>
                <p>{t("termsPage.section10Text")}</p>
                  {section10List.map((item, index) => (
                  <p key={index}><strong>{item}</strong></p>
                ))}
              </section>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  )
}
