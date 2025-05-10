"use client"
import { Button } from "@heroui/button"
import { Eye, Save } from "lucide-react"
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
  const { success, error } = useAlert()
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

    // Validar el formulario antes de enviar
    if (validateAndSubmit()) {
      try {
        console.log("Datos del evento a enviar:", eventData)
        // const response = await createEvent(eventData)
        success("Evento creado correctamente")
        // navigate(`/events/${response.id}`)
      } catch (err) {
        console.error("Error al crear el evento:", err)
        error(err.message || "Error al crear el evento")
      }
    }
  }

  // Función para navegar entre secciones sin validación
  const handleSectionChange = (section) => {
    toggleSection(section)
  }

  // Función para marcar sección como completada sin validación
  const handleSectionComplete = (section) => {
    markSectionAsCompleted(section)
  }

  return (
    <>
      <Navbar isAuthenticated={true} />
      <main className="min-h-screen bg-[#F3F0FA] pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-[#2E1A47]">Crear nuevo evento</h1>
              <div className="flex gap-2">
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
                >
                  Guardar evento
                </Button>
              </div>
            </div>

            <div className="text-sm text-[#5C3D8D] mb-6">
              <p>
                Completa todas las secciones para crear tu evento. Las secciones marcadas con{" "}
                <span className="text-red-500">*</span> son obligatorias.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Información básica */}
              <BasicInfoSection
                isOpen={openSection === "basic"}
                toggleOpen={() => handleSectionChange("basic")}
                isCompleted={completedSections.basic}
                onNext={() => {
                  handleSectionComplete("basic")
                  handleSectionChange("details")
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
                  handleSectionComplete("details")
                  handleSectionChange("artists")
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
                  handleSectionComplete("artists")
                  handleSectionChange("gallery")
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
                  handleSectionComplete("gallery")
                  handleSectionChange("faqs")
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
                  handleSectionComplete("faqs")
                  handleSectionChange("tickets")
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
                  handleSectionComplete("tickets")
                  if (eventData.hasSeating) {
                    handleSectionChange("seating")
                  } else {
                    success("Todas las secciones completadas", "Puedes guardar el evento cuando estés listo")
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
                    handleSectionComplete("seating")
                    success("Todas las secciones completadas", "Puedes guardar el evento cuando estés listo")
                  }}
                  eventData={eventData}
                  setEventData={setEventData}
                />
              )}
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-[#2E1A47]">¿Todo listo?</h2>
                <p className="text-sm text-[#5C3D8D]">Revisa toda la información antes de guardar tu evento.</p>
              </div>
              <Button
                className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                startContent={<Save size={18} />}
                onClick={handleSubmit}
              >
                Guardar evento
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
