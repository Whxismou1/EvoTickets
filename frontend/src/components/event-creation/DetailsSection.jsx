"use client"

import { Info, Plus, Trash2 } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"

const DetailsSection = ({ isOpen, toggleOpen, isCompleted, onPrevious, onNext, eventData, setEventData }) => {
  const handleHighlightChange = (index, value) => {
    const newHighlights = [...eventData.highlights]
    newHighlights[index] = value
    setEventData({ ...eventData, highlights: newHighlights })
  }

  const addHighlight = () => {
    setEventData({ ...eventData, highlights: [...eventData.highlights, ""] })
  }

  const removeHighlight = (index) => {
    const newHighlights = [...eventData.highlights]
    newHighlights.splice(index, 1)
    setEventData({ ...eventData, highlights: newHighlights })
  }

  // Modificar la función onNext para validar antes de avanzar
  const handleNext = () => {
    // Aquí puedes añadir tu propia validación si es necesario
    onNext()
  }

  return (
    <AccordionSection
      title="Detalles del evento"
      icon={<Info className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      <FormField label="Descripción detallada" required>
        <textarea
          name="longDescription"
          value={eventData.longDescription || ""}
          onChange={(e) => setEventData({ ...eventData, longDescription: e.target.value })}
          rows="6"
          className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
          placeholder="Describe tu evento con detalle. Incluye información sobre lo que los asistentes pueden esperar."
        ></textarea>
      </FormField>

      <FormField label="Destacados del evento" required>
        <div className="space-y-2">
          {eventData.highlights.map((highlight, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={highlight}
                onChange={(e) => handleHighlightChange(index, e.target.value)}
                className="flex-grow px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                placeholder="Ej. 20 artistas en 3 escenarios"
              />
              <button
                type="button"
                onClick={() => removeHighlight(index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                disabled={eventData.highlights.length === 1}
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addHighlight}
            className="flex items-center text-[#5C3D8D] hover:text-[#2E1A47] text-sm"
          >
            <Plus className="h-4 w-4 mr-1" /> Añadir destacado
          </button>
        </div>
      </FormField>

      <div className="flex justify-between mt-4">
        <Button type="button" variant="light" className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10" onClick={onPrevious}>
          Volver a Información básica
        </Button>
        {/* Actualizar el botón de Siguiente para usar handleNext */}
        <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={handleNext}>
          Siguiente: Artistas
        </Button>
      </div>
    </AccordionSection>
  )
}

export default DetailsSection
