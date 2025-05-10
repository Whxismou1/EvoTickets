"use client"

import { useRef } from "react"
import { ImageIcon, AlertCircle, Plus, Trash2, Upload, X } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"

const GallerySection = ({ isOpen, toggleOpen, isCompleted, onPrevious, onNext, eventData, setEventData }) => {
  const galleryImageRef = useRef(null)

  const handlePreviousEventChange = (index, field, value) => {
    const newPreviousEvents = [...eventData.previousEvents]
    newPreviousEvents[index] = { ...newPreviousEvents[index], [field]: value }
    setEventData({ ...eventData, previousEvents: newPreviousEvents })
  }

  const handleGalleryImageUpload = (eventIndex, e) => {
    const files = e.target.files
    if (files.length > 0) {
      const newImages = [...eventData.previousEvents[eventIndex].images]

      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = () => {
          newImages.push(reader.result)
          const newPreviousEvents = [...eventData.previousEvents]
          newPreviousEvents[eventIndex] = { ...newPreviousEvents[eventIndex], images: newImages }
          setEventData({ ...eventData, previousEvents: newPreviousEvents })
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const addPreviousEvent = () => {
    setEventData({
      ...eventData,
      previousEvents: [...eventData.previousEvents, { year: "", images: [] }],
    })
  }

  const removePreviousEvent = (index) => {
    const newPreviousEvents = [...eventData.previousEvents]
    newPreviousEvents.splice(index, 1)
    setEventData({ ...eventData, previousEvents: newPreviousEvents })
  }

  const removeGalleryImage = (eventIndex, imageIndex) => {
    const newPreviousEvents = [...eventData.previousEvents]
    newPreviousEvents[eventIndex].images.splice(imageIndex, 1)
    setEventData({ ...eventData, previousEvents: newPreviousEvents })
  }

  return (
    <AccordionSection
      title="Galería de ediciones anteriores (Opcional)"
      icon={<ImageIcon className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      <div className="bg-[#F3F0FA]/50 p-4 rounded-lg flex items-start gap-3 mb-4">
        <AlertCircle className="h-5 w-5 text-[#5C3D8D] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-[#2E1A47]">
            Esta sección es opcional. Puedes añadir imágenes de ediciones anteriores si el evento ya se ha celebrado
            antes.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        {eventData.previousEvents.map((event, eventIndex) => (
          <div key={eventIndex} className="border border-[#A28CD4]/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-[#2E1A47]">Edición anterior {eventIndex + 1}</h3>
              <button
                type="button"
                onClick={() => removePreviousEvent(eventIndex)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <FormField label="Año" required>
              <input
                type="text"
                value={event.year || ""}
                onChange={(e) => handlePreviousEventChange(eventIndex, "year", e.target.value)}
                className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                placeholder="Ej. 2024"
              />
            </FormField>

            <FormField label="Imágenes" required>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {event.images.map((image, imageIndex) => (
                  <div key={imageIndex} className="relative">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Imagen ${imageIndex + 1}`}
                      className="h-24 w-full object-cover rounded-md"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md"
                      onClick={() => removeGalleryImage(eventIndex, imageIndex)}
                    >
                      <X className="h-3 w-3 text-red-500" />
                    </button>
                  </div>
                ))}
                <div
                  className="h-24 border-2 border-dashed border-[#A28CD4]/40 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3F0FA] transition-colors"
                  onClick={() => galleryImageRef.current.click()}
                >
                  <Upload className="h-6 w-6 text-[#5C3D8D]/50 mb-1" />
                  <span className="text-xs text-[#5C3D8D]">Añadir imágenes</span>
                  <input
                    type="file"
                    ref={galleryImageRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleGalleryImageUpload(eventIndex, e)}
                  />
                </div>
              </div>
            </FormField>
          </div>
        ))}

        <button
          type="button"
          onClick={addPreviousEvent}
          className="w-full py-3 border-2 border-dashed border-[#A28CD4]/40 rounded-lg flex items-center justify-center text-[#5C3D8D] hover:bg-[#F3F0FA] transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" /> Añadir edición anterior
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="light" className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10" onClick={onPrevious}>
          Volver a Artistas
        </Button>
        <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={onNext}>
          Siguiente: FAQs
        </Button>
      </div>
    </AccordionSection>
  )
}

export default GallerySection
