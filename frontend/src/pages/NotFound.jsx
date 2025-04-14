"use client"

import { Link } from "react-router-dom"
import { ArrowLeft, MapPin } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@heroui/react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#F3F0FA] flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#A28CD4]/20 mb-6">
                <MapPin className="h-12 w-12 text-[#5C3D8D]" />
              </div>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-7xl font-bold text-[#2E1A47] mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t("not_found.title")}
            </motion.h1>

            <motion.h2
              className="text-2xl md:text-4xl font-bold text-[#5C3D8D] mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t("not_found.subtitle")}
            </motion.h2>

            <motion.p
              className="text-lg text-[#5C3D8D] mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {t("not_found.description")}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link to="/">
                <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white flex items-center gap-2">
                  <ArrowLeft className="h-5 w-5" />
                  {t("not_found.backToHome")}
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" className="border-[#5C3D8D] text-[#5C3D8D] hover:bg-[#5C3D8D]/10">
                {t("not_found.exploreEvents")}
                </Button>
              </Link> 
            </motion.div>

            <motion.div
              className="mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <p className="text-[#5C3D8D]/60">
                {t("not_found.needHelp")}{" "}
                <Link to="/contact" className="text-[#5C3D8D] underline hover:text-[#2E1A47]">
                  {t("not_found.contactUs")}
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
