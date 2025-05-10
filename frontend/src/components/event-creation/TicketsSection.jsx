"use client"

import { Ticket, AlertCircle, Plus, Trash2, Euro } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"

const TicketsSection = ({ isOpen, toggleOpen, isCompleted, onPrevious, onNext, eventData, setEventData }) => {
  const handleTicketTypeChange = (index, field, value) => {
    const newTicketTypes = [...eventData.ticketTypes]
    newTicketTypes[index] = { ...newTicketTypes[index], [field]: value }
    setEventData({ ...eventData, ticketTypes: newTicketTypes })
  }

  const addTicketType = () => {
    setEventData({
      ...eventData,
      ticketTypes: [...eventData.ticketTypes, { name: "", price: "", description: "", limit: "" }],
    })
  }

  const removeTicketType = (index) => {
    const newTicketTypes = [...eventData.ticketTypes]
    newTicketTypes.splice(index, 1)
    setEventData({ ...eventData, ticketTypes: newTicketTypes })
  }

  return (
    <AccordionSection
      title="Entradas y precios"
      icon={<Ticket className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      <div className="space-y-6">
        <FormField
          label="¿El evento tiene asientos asignados?"
          tooltip="Si seleccionas 'Sí', podrás crear un mapa de asientos en la siguiente sección"
        >
          <div className="flex items-center space-x-4 mt-1">
            <label className="flex items-center">
              <input
                type="radio"
                name="hasSeating"
                checked={eventData.hasSeating === true}
                onChange={() => setEventData({ ...eventData, hasSeating: true })}
                className="mr-2"
              />
              Sí
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="hasSeating"
                checked={eventData.hasSeating === false}
                onChange={() => setEventData({ ...eventData, hasSeating: false })}
                className="mr-2"
              />
              No
            </label>
          </div>
        </FormField>

        {eventData.hasSeating && (
          <div className="bg-[#F3F0FA]/50 p-4 rounded-lg flex items-start gap-3 mt-2 mb-4">
            <AlertCircle className="h-5 w-5 text-[#5C3D8D] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#2E1A47]">
                Los tipos de entradas que definas aquí estarán disponibles para asignar a las zonas del mapa de asientos
                en la siguiente sección.
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-[#A28CD4]/20 pt-4">
          <h3 className="font-medium text-[#2E1A47] mb-4">Tipos de entradas</h3>

          {eventData.ticketTypes.map((ticket, index) => (
            <div key={index} className="border border-[#A28CD4]/20 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-[#2E1A47]">Entrada {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeTicketType(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                  disabled={eventData.ticketTypes.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre" required>
                  <input
                    type="text"
                    value={ticket.name || ""}
                    onChange={(e) => handleTicketTypeChange(index, "name", e.target.value)}
                    className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                    placeholder="Ej. Entrada General"
                  />
                </FormField>

                <FormField label="Precio" required>
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C3D8D]/60 h-4 w-4" />
                    <input
                      type="text"
                      value={ticket.price || ""}
                      onChange={(e) => handleTicketTypeChange(index, "price", e.target.value)}
                      className="w-full pl-10 px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                      placeholder="Ej. 45.00"
                    />
                  </div>
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Descripción" required={false}>
                    <textarea
                      value={ticket.description || ""}
                      onChange={(e) => handleTicketTypeChange(index, "description", e.target.value)}
                      rows="2"
                      className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                      placeholder="Describe lo que incluye esta entrada"
                    ></textarea>
                  </FormField>
                </div>

                <FormField label="Límite de entradas" required={false} tooltip="Deja en blanco si no hay límite">
                  <input
                    type="number"
                    value={ticket.limit || ""}
                    onChange={(e) => handleTicketTypeChange(index, "limit", e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                    placeholder="Ej. 1000"
                  />
                </FormField>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTicketType}
            className="w-full py-3 border-2 border-dashed border-[#A28CD4]/40 rounded-lg flex items-center justify-center text-[#5C3D8D] hover:bg-[#F3F0FA] transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" /> Añadir tipo de entrada
          </button>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="light" className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10" onClick={onPrevious}>
          Volver a FAQs
        </Button>
        <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={onNext}>
          {eventData.hasSeating ? "Siguiente: Mapa de asientos" : "Finalizar"}
        </Button>
      </div>
    </AccordionSection>
  )
}

export default TicketsSection
