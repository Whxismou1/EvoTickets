"use client"

import { Users, Award, Calendar, MapPin } from "lucide-react"
import { Button } from "@heroui/button"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function AboutUsPage() {
  const { alert, showAlert, hideAlert } = useAlert();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: t("aboutUs.members.mouhcine.name"),
      role: t("aboutUs.members.mouhcine.role"),
      image: "/placeholder.svg?height=200&width=200",
      bio: t("aboutUs.members.mouhcine.bio"),
    },
    {
      name: t("aboutUs.members.javier.name"),
      role: t("aboutUs.members.javier.role"),
      image: "/placeholder.svg?height=200&width=200",
      bio: t("aboutUs.members.javier.bio"),
    },
    {
      name: t("aboutUs.members.oscar.name"),
      role: t("aboutUs.members.oscar.role"),
      image: "/placeholder.svg?height=200&width=200",
      bio: t("aboutUs.members.oscar.bio"),
    },
    {
      name: t("aboutUs.members.cristian.name"),
      role: t("aboutUs.members.cristian.role"),
      image: "/placeholder.svg?height=200&width=200",
      bio: t("aboutUs.members.cristian.bio"),
    },
  ]

  const milestones = [
    {
      year: t("aboutUs.milestones.2025-feb.year"),
      title: t("aboutUs.milestones.2025-feb.title"),
      description: t("aboutUs.milestones.2025-feb.description"),
    },
    {
      year: t("aboutUs.milestones.2025-abr.year"),
      title: t("aboutUs.milestones.2025-abr.title"),
      description: t("aboutUs.milestones.2025-abr.description"),
    },
    {
      year: t("aboutUs.milestones.2025-may.year"),
      title: t("aboutUs.milestones.2025-may.title"),
      description: t("aboutUs.milestones.2025-may.description"),
    },
    {
      year: t("aboutUs.milestones.prox.year"),
      title: t("aboutUs.milestones.prox.title"),
      description: t("aboutUs.milestones.prox.description"),
    }
  ]
  const handleJoinTeam = () => {
    showAlert({
      type: "info",
      message: "Te redirigiremos a nuestras ofertas de empleo",
    });
    navigate("/WorkWithUsPage");
    window.scrollTo(0,0);
  }

  return (
    <>
      <Nav />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-screen bg-[#F9F7FD] pt-24 pb-12">
        {/* Hero Section */}
        <div className="bg-[#5C3D8D] text-white py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{t("aboutUs.title")}</h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                {t("aboutUs.heroDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Nuestra Misión */}
        <div className="container mx-auto px-4 max-w-5xl py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2E1A47] mb-4">{t("aboutUs.missionTitle")}</h2>
              <p className="text-[#5C3D8D] mb-4">
                {t("aboutUs.missionP1")}
              </p>
              <p className="text-[#5C3D8D] mb-4">
                {t("aboutUs.missionP2")}
              </p>
              <p className="text-[#5C3D8D]">
                {t("aboutUs.missionP3")}
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">+2M</h3>
                  <p className="text-[#5C3D8D]">{t("aboutUs.stats.users")}</p>
                </div>
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">+10K</h3>
                  <p className="text-[#5C3D8D]">{t("aboutUs.stats.events")}</p>
                </div>
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">5</h3>
                  <p className="text-[#5C3D8D]">{t("aboutUs.stats.countries")}</p>
                </div>
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">98%</h3>
                  <p className="text-[#5C3D8D]">{t("aboutUs.stats.satisfaction")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nuestra Historia */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-[#2E1A47] mb-12 text-center">{t("aboutUs.historyTitle")}</h2>

            <div className="relative">
              {/* Línea vertical */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#A28CD4]/30"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                      <h3 className="text-xl font-semibold text-[#2E1A47] mb-2">{milestone.title}</h3>
                      <p className="text-[#5C3D8D]">{milestone.description}</p>
                    </div>

                    <div className="z-10 flex-shrink-0">
                      <div className="bg-[#5C3D8D] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"></div>
                    </div>

                    <div className={`w-1/2 ${index % 2 === 0 ? "pl-12" : "pr-12 text-right"}`}>
                      <div className="text-xl font-bold text-[#5C3D8D]">{milestone.year}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Nuestro Equipo */}
        <div className="container mx-auto px-4 max-w-5xl py-16">
          <h2 className="text-3xl font-bold text-[#2E1A47] mb-12 text-center">{t("aboutUs.teamTitle")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#2E1A47]">{member.name}</h3>
                  <p className="text-[#5C3D8D] font-medium mb-2">{member.role}</p>
                  <p className="text-[#5C3D8D]/80 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-[#2E1A47] mb-4">{t("aboutUs.joinTitle")}</h3>
            <p className="text-[#5C3D8D] mb-6 max-w-2xl mx-auto">
              {t("aboutUs.joinDescription")}
            </p>
            <Button onPress={handleJoinTeam} className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
              {t("aboutUs.jobOffer")}
            </Button>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-[#F3F0FA] py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-[#2E1A47] mb-12 text-center">{t("aboutUs.values.title")}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2E1A47] mb-2">{t("aboutUs.values.innovation.title")}</h3>
                <p className="text-[#5C3D8D]">
                  {t("aboutUs.values.innovation.description")}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2E1A47] mb-2">{t("aboutUs.values.community.title")}</h3>
                <p className="text-[#5C3D8D]">
                  {t("aboutUs.values.community.description")}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2E1A47] mb-2">{t("aboutUs.values.trust.title")}</h3>
                <p className="text-[#5C3D8D]">
                  {t("aboutUs.values.trust.description")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
