"use client"
import { useState } from "react"
import { Button } from "@heroui/button"
import { Eye, Save, ArrowLeft, Check, AlertTriangle } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { useNavigate } from "react-router-dom"

// Importar componentes de secciones
import BasicInfoSection from "../components/event-creation/BasicInfoSection"
import DetailsSection from "../components/event-creation/DetailsSection"
import ArtistsSection from "../components/event-creation/ArtistsSection"
import GallerySection from "../components/event-creation/GallerySection"
import FaqsSection from "../components/event-creation/FaqsSection"
import TicketsSection from "../components/event-creation/TicketsSection"
import SeatingSection from "../components/event-creation/SeatingSection"

// Importar el hook personalizado para el estado del evento
import { useEventForm } from "../hooks/useEventForm"
import { useAlert } from "../context/AlertContext"
import { createEvent } from "../services/eventService"

export default function EventCreationPage() {
  const navigate = useNavigate()
  const { success, error, info } = useAlert()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSectionStatus, setShowSectionStatus] = useState(false)

  const {
    eventData,
    setEventData,
    completedSections,
    openSection,
    toggleSection,
    markSectionAsCompleted,
    handleSubmit: validateAndSubmit,
  } = useEventForm()

  const handlePreview = () => {
    success("Vista previa generada", "Se ha abierto la vista previa del evento en una nueva pestaña.")
    // Aquí iría la lógica para abrir la vista previa
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validar el formulario antes de enviar
    if (validateAndSubmit()) {
      try {
        console.log("Datos del evento a enviar:", eventData)
        const response = await createEvent(eventData)
        success("Evento creado correctamente")
        navigate(`/events/${response.id}`)
      } catch (err) {
        console.error("Error al crear el evento:", err)
        error(err.message || "Error al crear el evento")
      } finally {
        setIsSubmitting(false)
      }
    } else {
      setIsSubmitting(false)
      setShowSectionStatus(true)
      setTimeout(() => setShowSectionStatus(false), 5000)
    }
  }

  // Modificar la función handleSectionChange para que no valide al cambiar de sección
  const handleSectionChange = (section) => {
    toggleSection(section)
  }

  // Modificar la función handleSectionComplete para que sea opcional la validación
  const handleSectionComplete = (section, validate = false) => {
    return markSectionAsCompleted(section, validate)
  }

  // Función para verificar el estado de cada sección
  const getSectionStatus = (section) => {
    if (completedSections[section]) return "completed"
    if (showSectionStatus && section === openSection) return "active"
    return "pending"
  }

  // Renderizar el indicador de estado para cada sección
  const renderSectionStatus = (section) => {
    const status = getSectionStatus(section)

    if (status === "completed") {
      return <Check size={16} className="text-green-500" />
    } else if (status === "active" && showSectionStatus) {
      return <AlertTriangle size={16} className="text-amber-500" />
    }

    return null
  }

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Cabecera */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center mb-6">
              <Button
                as="a"
                onPress={() => navigate(-1)}
                variant="light"
                className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10 mr-4"
                startContent={<ArrowLeft size={18} />}
              >
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-[#2E1A47]">Crear nuevo evento</h1>
                <p className="text-sm text-[#5C3D8D]">
                  Completa todas las secciones para crear tu evento. Las secciones marcadas con{" "}
                  <span className="text-red-500">*</span> son obligatorias.
                </p>
              </div>
            </div>

            {/* Progreso */}
            <div className="bg-[#F3F0FA]/50 p-4 rounded-lg mb-6">
              <div className="flex flex-wrap gap-2">
                <div
                  onClick={() => handleSectionChange("basic")}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                    openSection === "basic"
                      ? "bg-[#5C3D8D] text-white"
                      : completedSections.basic
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5C3D8D]"
                  }`}
                >
                  Información básica {renderSectionStatus("basic")}
                </div>
                <div
                  onClick={() => handleSectionChange("details")}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                    openSection === "details"
                      ? "bg-[#5C3D8D] text-white"
                      : completedSections.details
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5C3D8D]"
                  }`}
                >
                  Detalles {renderSectionStatus("details")}
                </div>
                <div
                  onClick={() => handleSectionChange("artists")}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                    openSection === "artists"
                      ? "bg-[#5C3D8D] text-white"
                      : completedSections.artists
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5C3D8D]"
                  }`}
                >
                  Artistas {renderSectionStatus("artists")}
                </div>
                <div
                  onClick={() => handleSectionChange("gallery")}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                    openSection === "gallery"
                      ? "bg-[#5C3D8D] text-white"
                      : completedSections.gallery
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5C3D8D]"
                  }`}
                >
                  Galería {renderSectionStatus("gallery")}
                </div>
                <div
                  onClick={() => handleSectionChange("faqs")}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                    openSection === "faqs"
                      ? "bg-[#5C3D8D] text-white"
                      : completedSections.faqs
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5C3D8D]"
                  }`}
                >
                  FAQs {renderSectionStatus("faqs")}
                </div>
                <div
                  onClick={() => handleSectionChange("tickets")}
                  className={`flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                    openSection === "tickets"
                      ? "bg-[#5C3D8D] text-white"
                      : completedSections.tickets
                        ? "bg-green-100 text-green-800"
                        : "bg-white text-[#5C3D8D]"
                  }`}
                >
                  Entradas {renderSectionStatus("tickets")}
                </div>
                {eventData.hasSeating && (
                  <div
                    onClick={() => handleSectionChange("seating")}
                    className={`flex items-center px-3 py-1.5 rounded-full text-sm cursor-pointer ${
                      openSection === "seating"
                        ? "bg-[#5C3D8D] text-white"
                        : completedSections.seating
                          ? "bg-green-100 text-green-800"
                          : "bg-white text-[#5C3D8D]"
                    }`}
                  >
                    Asientos {renderSectionStatus("seating")}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Información básica */}
              <BasicInfoSection
                isOpen={openSection === "basic"}
                toggleOpen={() => handleSectionChange("basic")}
                isCompleted={completedSections.basic}
                onNext={() => {
                  if (handleSectionComplete("basic", true)) {
                    handleSectionChange("details")
                  }
                }}
                eventData={eventData}
                setEventData={setEventData}
              />

              {/* Detalles del evento */}
              <DetailsSection
                isOpen={openSection === "details"}
                toggleOpen={() => handleSectionChange("details")}
                isCompleted={completedSections.details}
                onPrevious={() => handleSectionChange("basic")}
                onNext={() => {
                  if (handleSectionComplete("details", true)) {
                    handleSectionChange("artists")
                  }
                }}
                eventData={eventData}
                setEventData={setEventData}
              />

              {/* Artistas */}
              <ArtistsSection
                isOpen={openSection === "artists"}
                toggleOpen={() => handleSectionChange("artists")}
                isCompleted={completedSections.artists}
                onPrevious={() => handleSectionChange("details")}
                onNext={() => {
                  if (handleSectionComplete("artists", true)) {
                    handleSectionChange("gallery")
                  }
                }}
                eventData={eventData}
                setEventData={setEventData}
              />

              {/* Galería de ediciones anteriores */}
              <GallerySection
                isOpen={openSection === "gallery"}
                toggleOpen={() => handleSectionChange("gallery")}
                isCompleted={completedSections.gallery}
                onPrevious={() => handleSectionChange("artists")}
                onNext={() => {
                  if (handleSectionComplete("gallery", true)) {
                    handleSectionChange("faqs")
                  }
                }}
                eventData={eventData}
                setEventData={setEventData}
              />

              {/* FAQs */}
              <FaqsSection
                isOpen={openSection === "faqs"}
                toggleOpen={() => handleSectionChange("faqs")}
                isCompleted={completedSections.faqs}
                onPrevious={() => handleSectionChange("gallery")}
                onNext={() => {
                  if (handleSectionComplete("faqs", true)) {
                    handleSectionChange("tickets")
                  }
                }}
                eventData={eventData}
                setEventData={setEventData}
              />

              {/* Entradas */}
              <TicketsSection
                isOpen={openSection === "tickets"}
                toggleOpen={() => handleSectionChange("tickets")}
                isCompleted={completedSections.tickets}
                onPrevious={() => handleSectionChange("faqs")}
                onNext={() => {
                  if (handleSectionComplete("tickets", true)) {
                    if (eventData.hasSeating) {
                      handleSectionChange("seating")
                    } else {
                      success("Todas las secciones completadas", "Puedes guardar el evento cuando estés listo")
                    }
                  }
                }}
                eventData={eventData}
                setEventData={setEventData}
              />

              {/* Mapa de asientos (solo si hasSeating es true) */}
              {eventData.hasSeating && (
                <SeatingSection
                  isOpen={openSection === "seating"}
                  toggleOpen={() => handleSectionChange("seating")}
                  isCompleted={completedSections.seating}
                  onPrevious={() => handleSectionChange("tickets")}
                  onFinish={() => {
                    // Solo validar cuando el usuario hace clic en "Finalizar"
                    const isCompleted = handleSectionComplete("seating", true)
                    if (isCompleted) {
                      success("Todas las secciones completadas", "Puedes guardar el evento cuando estés listo")
                    }
                  }}
                  eventData={eventData}
                  setEventData={setEventData}
                />
              )}
            </form>
          </div>

          {/* Acciones finales */}
          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[#2E1A47]">¿Todo listo?</h2>
                <p className="text-sm text-[#5C3D8D]">Revisa toda la información antes de guardar tu evento.</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="light"
                  className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                  startContent={<Eye size={18} />}
                  onClick={handlePreview}
                >
                  Vista previa
                </Button>
                <Button
                  className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                  startContent={<Save size={18} />}
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                >
                  Guardar evento
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
