"use client"

import { useRef } from "react"
import { Info, Upload, X } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"

const BasicInfoSection = ({ isOpen, toggleOpen, isCompleted, onNext, eventData, setEventData }) => {
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEventData({ ...eventData, [name]: value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setEventData({ ...eventData, image: reader.result })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <AccordionSection
      title="Información básica"
      icon={<Info className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <FormField label="Imagen principal del evento" required>
            <div className="mt-1 flex items-center">
              {eventData.image ? (
                <div className="relative">
                  <img
                    src={eventData.image || "/placeholder.svg"}
                    alt="Vista previa"
                    className="h-32 w-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                    onClick={() => setEventData({ ...eventData, image: null })}
                  >
                    <X className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ) : (
                <div
                  className="h-32 w-full border-2 border-dashed border-[#A28CD4]/40 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-[#F3F0FA] transition-colors"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Upload className="h-8 w-8 text-[#5C3D8D]/50 mb-2" />
                  <span className="text-sm text-[#5C3D8D]">Haz clic para subir imagen</span>
                  <span className="text-xs text-[#5C3D8D]/70 mt-1">Recomendado: 1200x600px, máx 2MB</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </FormField>
        </div>

        <div className="md:col-span-2">
          <FormField label="Título del evento" required>
            <input
              type="text"
              name="name"
              value={eventData.name || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
              placeholder="Ej. Festival de Música Urbana 2025"
            />
          </FormField>
        </div>

        <FormField label="Categoría" required>
          <select
            name="category"
            value={eventData.category || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
          >
            <option value="">Selecciona una categoría</option>
            <option value="concerts">Concierto</option>
            <option value="festivals">Festival</option>
            <option value="sports">Deporte</option>
            <option value="theater">Teatro</option>
            <option value="comedy">Comedia</option>
            <option value="other">Otro</option>
          </select>
        </FormField>

        <FormField label="Organizador" required>
          <input
            type="text"
            name="organizer"
            value={eventData.organizer || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
            placeholder="Ej. Urban Events S.L."
          />
        </FormField>

        <FormField label="Ubicación" required>
          <input
            type="text"
            name="location"
            value={eventData.location || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
            placeholder="Ej. Wizink Center"
          />
        </FormField>

        <FormField label="Dirección completa" required>
          <input
            type="text"
            name="address"
            value={eventData.address || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
            placeholder="Ej. Av. Felipe II, s/n, 28009 Madrid"
          />
        </FormField>

        <FormField label="Fecha de inicio" required={false}>
          <div className="space-y-2">
            <input
              type="datetime-local"
              name="startDate"
              value={eventData.startDate || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
              disabled={eventData.dateToBeConfirmed}
            />
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                name="dateToBeConfirmed"
                checked={eventData.dateToBeConfirmed || false}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    dateToBeConfirmed: e.target.checked,
                    date: e.target.checked ? "" : eventData.startDate,
                  })
                }
                className="mr-2"
              />
              Fecha por confirmar (próximamente)
            </label>
          </div>
        </FormField>

        <FormField label="Fecha de finalización" required={false}>
          <div className="space-y-2">
            <input
              type="datetime-local"
              name="endDate"
              value={eventData.endDate || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
              disabled={eventData.endDateToBeConfirmed}
            />
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                name="endDateToBeConfirmed"
                checked={eventData.endDateToBeConfirmed || false}
                onChange={(e) =>
                  setEventData({
                    ...eventData,
                    endDateToBeConfirmed: e.target.checked,
                    endDate: e.target.checked ? "" : eventData.endDate,
                  })
                }
                className="mr-2"
              />
              Fecha por confirmar (próximamente)
            </label>
          </div>
        </FormField>

        <FormField label="Sitio web" required={false}>
          <input
            type="url"
            name="website"
            value={eventData.website || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
            placeholder="https://www.mievento.com"
          />
        </FormField>

        <FormField label="Edad mínima" required={false}>
          <input
            type="number"
            name="minAge"
            value={eventData.minAge || ""}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
            placeholder="Ej. 18"
          />
        </FormField>

        <FormField label="Capacidad" required={false}>
          <input
            type="number"
            name="capacity"
            value={eventData.capacity || ""}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
            placeholder="Ej. 5000"
          />
        </FormField>

        <div className="md:col-span-2">
          <FormField label="Descripción corta" required>
            <textarea
              name="description"
              value={eventData.description || ""}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
              placeholder="Breve descripción del evento (máx. 200 caracteres)"
              maxLength="200"
            ></textarea>
            <div className="text-xs text-right text-[#5C3D8D]/70 mt-1">
              {(eventData.description || "").length}/200 caracteres
            </div>
          </FormField>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={onNext}>
          Siguiente: Detalles
        </Button>
      </div>
    </AccordionSection>
  )
}

export default BasicInfoSection
