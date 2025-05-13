"use client"

import { Users, Award, Calendar, MapPin } from "lucide-react"
import { Button } from "@heroui/button"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"

const teamMembers = [
  {
    name: "Ana García",
    role: "CEO & Fundadora",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Ana fundó EvoTickets con la visión de transformar la experiencia de compra de entradas para eventos.",
  },
  {
    name: "Carlos Rodríguez",
    role: "CTO",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Carlos lidera el equipo técnico y es responsable de la innovación tecnológica de la plataforma.",
  },
  {
    name: "Laura Martínez",
    role: "Directora de Marketing",
    image: "/placeholder.svg?height=200&width=200",
    bio: "Laura tiene más de 10 años de experiencia en marketing digital y estrategias de crecimiento.",
  },
  {
    name: "David Sánchez",
    role: "Director de Operaciones",
    image: "/placeholder.svg?height=200&width=200",
    bio: "David supervisa todas las operaciones diarias y asegura que cada evento sea un éxito.",
  },
]

const milestones = [
  {
    year: "2018",
    title: "Fundación de EvoTickets",
    description: "EvoTickets nace como una startup con la misión de revolucionar la venta de entradas online.",
  },
  {
    year: "2019",
    title: "Primera ronda de financiación",
    description: "Conseguimos nuestra primera ronda de inversión de 1.5 millones de euros.",
  },
  {
    year: "2020",
    title: "Expansión nacional",
    description: "Ampliamos nuestra presencia a todas las comunidades autónomas de España.",
  },
  {
    year: "2021",
    title: "Lanzamiento de la app móvil",
    description:
      "Lanzamos nuestra aplicación móvil para iOS y Android, facilitando la compra de entradas desde cualquier lugar.",
  },
  {
    year: "2022",
    title: "Internacionalización",
    description: "Comenzamos nuestra expansión internacional con presencia en Portugal, Francia e Italia.",
  },
  {
    year: "2023",
    title: "Premio a la innovación",
    description: "Recibimos el premio a la startup más innovadora en el sector del entretenimiento.",
  },
]

export default function AboutUsPage() {
  const { alert, showAlert, hideAlert } = useAlert()

  const handleJoinTeam = () => {
    showAlert({
      type: "info",
      message: "Te redirigiremos a nuestras ofertas de empleo",
    })
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
              <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
              <p className="text-xl max-w-3xl mx-auto opacity-90">
                Transformando la forma en que las personas descubren, compran y disfrutan de eventos en vivo.
              </p>
            </div>
          </div>
        </div>

        {/* Nuestra Misión */}
        <div className="container mx-auto px-4 max-w-5xl py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#2E1A47] mb-4">Nuestra Misión</h2>
              <p className="text-[#5C3D8D] mb-4">
                En EvoTickets, nuestra misión es conectar a las personas con experiencias inolvidables a través de una
                plataforma de venta de entradas segura, accesible y fácil de usar.
              </p>
              <p className="text-[#5C3D8D] mb-4">
                Creemos que cada evento tiene el poder de crear recuerdos duraderos, y trabajamos incansablemente para
                asegurarnos de que nuestros usuarios puedan descubrir y asistir a los eventos que más les apasionan.
              </p>
              <p className="text-[#5C3D8D]">
                Nuestra visión es convertirnos en la plataforma líder de venta de entradas en Europa, ofreciendo la
                mejor experiencia tanto para organizadores como para asistentes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">+2M</h3>
                  <p className="text-[#5C3D8D]">Usuarios activos</p>
                </div>
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">+10K</h3>
                  <p className="text-[#5C3D8D]">Eventos anuales</p>
                </div>
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">5</h3>
                  <p className="text-[#5C3D8D]">Países</p>
                </div>
                <div className="bg-[#F3F0FA] p-6 rounded-lg text-center">
                  <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#2E1A47] mb-1">98%</h3>
                  <p className="text-[#5C3D8D]">Satisfacción</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nuestra Historia */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-[#2E1A47] mb-12 text-center">Nuestra Historia</h2>

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
                      <div className="bg-[#5C3D8D] w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
                        {milestone.year.slice(-2)}
                      </div>
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
          <h2 className="text-3xl font-bold text-[#2E1A47] mb-12 text-center">Nuestro Equipo</h2>

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
            <h3 className="text-xl font-semibold text-[#2E1A47] mb-4">¿Quieres unirte a nuestro equipo?</h3>
            <p className="text-[#5C3D8D] mb-6 max-w-2xl mx-auto">
              Estamos siempre buscando personas talentosas y apasionadas para unirse a nuestro equipo. Consulta nuestras
              ofertas de empleo actuales.
            </p>
            <Button onClick={handleJoinTeam} className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
              Ver ofertas de empleo
            </Button>
          </div>
        </div>

        {/* Valores */}
        <div className="bg-[#F3F0FA] py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-bold text-[#2E1A47] mb-12 text-center">Nuestros Valores</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="bg-[#5C3D8D] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#2E1A47] mb-2">Innovación</h3>
                <p className="text-[#5C3D8D]">
                  Buscamos constantemente nuevas formas de mejorar nuestra plataforma y ofrecer soluciones innovadoras.
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
                <h3 className="text-xl font-semibold text-[#2E1A47] mb-2">Comunidad</h3>
                <p className="text-[#5C3D8D]">
                  Creemos en el poder de los eventos para unir a las personas y crear comunidades vibrantes.
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
                <h3 className="text-xl font-semibold text-[#2E1A47] mb-2">Confianza</h3>
                <p className="text-[#5C3D8D]">
                  La seguridad y confianza son fundamentales en todo lo que hacemos, desde la compra de entradas hasta
                  la protección de datos.
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
