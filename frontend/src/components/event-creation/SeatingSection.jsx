"use client"

import { useState } from "react"
import { Layout, AlertCircle, Plus, Trash2, Euro } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"
import { useAlert } from "../../context/AlertContext"

const SeatingSection = ({ isOpen, toggleOpen, isCompleted, onPrevious, onFinish, eventData, setEventData }) => {
  const { info } = useAlert()
  const [activeTab, setActiveTab] = useState("simple") // simple o avanzado

  // Función para añadir una zona de asientos simple
  const addSimpleSection = (type) => {
    let newSection = {
      name: "",
      capacity: 100,
      price: "",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      ticketTypeId: null,
    }

    switch (type) {
      case "vip":
        newSection = {
          ...newSection,
          name: "Zona VIP",
          capacity: 50,
          color: "#5C3D8D",
        }
        break
      case "general":
        newSection = {
          ...newSection,
          name: "Zona General",
          capacity: 200,
          color: "#A28CD4",
        }
        break
      case "grada":
        newSection = {
          ...newSection,
          name: "Grada",
          capacity: 150,
          color: "#D7A6F3",
        }
        break
      case "custom":
        newSection = {
          ...newSection,
          name: `Zona ${eventData.seatingMap.sections.length + 1}`,
        }
        break
    }

    setEventData({
      ...eventData,
      seatingMap: {
        ...eventData.seatingMap,
        sections: [...eventData.seatingMap.sections, newSection],
      },
    })

    info(`Zona "${newSection.name}" añadida`)
  }

  const removeSeatingSection = (index) => {
    const newSections = [...eventData.seatingMap.sections]
    const removedSection = newSections[index]
    newSections.splice(index, 1)
    setEventData({
      ...eventData,
      seatingMap: { ...eventData.seatingMap, sections: newSections },
    })
    info(`Zona "${removedSection.name}" eliminada`)
  }

  const handleSeatingSectionChange = (index, field, value) => {
    const newSections = [...eventData.seatingMap.sections]
    newSections[index] = { ...newSections[index], [field]: value }
    setEventData({
      ...eventData,
      seatingMap: { ...eventData.seatingMap, sections: newSections },
    })
  }

  return (
    <AccordionSection
      title="Mapa de asientos"
      icon={<Layout className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      <div className="space-y-6">
        <div className="bg-[#F3F0FA]/50 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#5C3D8D] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#2E1A47]">
              Configura las zonas de asientos para tu evento. Puedes crear diferentes zonas con distintos precios.
            </p>
          </div>
        </div>

        {/* Pestañas para elegir modo simple o avanzado */}
        <div className="flex border-b border-[#A28CD4]/20">
          <button
            type="button"
            className={`py-2 px-4 ${
              activeTab === "simple"
                ? "border-b-2 border-[#5C3D8D] text-[#5C3D8D] font-medium"
                : "text-[#5C3D8D]/60 hover:text-[#5C3D8D]"
            }`}
            onClick={() => setActiveTab("simple")}
          >
            Modo Simple
          </button>
          <button
            type="button"
            className={`py-2 px-4 ${
              activeTab === "avanzado"
                ? "border-b-2 border-[#5C3D8D] text-[#5C3D8D] font-medium"
                : "text-[#5C3D8D]/60 hover:text-[#5C3D8D]"
            }`}
            onClick={() => setActiveTab("avanzado")}
          >
            Modo Avanzado
          </button>
        </div>

        {/* Modo Simple */}
        {activeTab === "simple" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => addSimpleSection("vip")}
                className="border rounded-lg p-4 text-center hover:bg-[#F3F0FA] transition-colors"
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  <div className="w-16 h-8 bg-[#5C3D8D] rounded-md"></div>
                </div>
                <h4 className="font-medium text-[#2E1A47]">Zona VIP</h4>
                <p className="text-xs text-[#5C3D8D]">Capacidad: 50 personas</p>
              </button>

              <button
                type="button"
                onClick={() => addSimpleSection("general")}
                className="border rounded-lg p-4 text-center hover:bg-[#F3F0FA] transition-colors"
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  <div className="w-16 h-8 bg-[#A28CD4] rounded-md"></div>
                </div>
                <h4 className="font-medium text-[#2E1A47]">Zona General</h4>
                <p className="text-xs text-[#5C3D8D]">Capacidad: 200 personas</p>
              </button>

              <button
                type="button"
                onClick={() => addSimpleSection("grada")}
                className="border rounded-lg p-4 text-center hover:bg-[#F3F0FA] transition-colors"
              >
                <div className="h-16 flex items-center justify-center mb-2">
                  <div className="w-16 h-8 bg-[#D7A6F3] rounded-md"></div>
                </div>
                <h4 className="font-medium text-[#2E1A47]">Grada</h4>
                <p className="text-xs text-[#5C3D8D]">Capacidad: 150 personas</p>
              </button>
            </div>

            <button
              type="button"
              onClick={() => addSimpleSection("custom")}
              className="w-full py-3 border-2 border-dashed border-[#A28CD4]/40 rounded-lg flex items-center justify-center text-[#5C3D8D] hover:bg-[#F3F0FA] transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Añadir zona personalizada
            </button>
          </div>
        )}

        {/* Modo Avanzado */}
        {activeTab === "avanzado" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-[#A28CD4]/20 rounded-lg p-4">
                <h3 className="font-medium text-[#2E1A47] mb-4">Disposición del escenario</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="border rounded-lg p-3 text-center hover:bg-[#F3F0FA] transition-colors"
                  >
                    <div className="h-16 flex items-center justify-center mb-2">
                      <div className="w-full max-w-[80px]">
                        <div className="h-4 bg-gray-300 rounded-t-md mb-2"></div>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="bg-[#5C3D8D]/80 rounded-md h-2"></div>
                          <div className="bg-[#5C3D8D] rounded-md h-2"></div>
                          <div className="bg-[#5C3D8D]/80 rounded-md h-2"></div>
                        </div>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium text-[#2E1A47]">Frontal</h4>
                  </button>

                  <button
                    type="button"
                    className="border rounded-lg p-3 text-center hover:bg-[#F3F0FA] transition-colors"
                  >
                    <div className="h-16 flex items-center justify-center mb-2">
                      <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    </div>
                    <h4 className="text-sm font-medium text-[#2E1A47]">Central</h4>
                  </button>
                </div>
              </div>

              <div className="border border-[#A28CD4]/20 rounded-lg p-4">
                <h3 className="font-medium text-[#2E1A47] mb-4">Forma del recinto</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className="border rounded-lg p-3 text-center hover:bg-[#F3F0FA] transition-colors"
                  >
                    <div className="h-16 flex items-center justify-center mb-2">
                      <div className="w-16 h-12 border border-[#5C3D8D] rounded-md"></div>
                    </div>
                    <h4 className="text-sm font-medium text-[#2E1A47]">Rectangular</h4>
                  </button>

                  <button
                    type="button"
                    className="border rounded-lg p-3 text-center hover:bg-[#F3F0FA] transition-colors"
                  >
                    <div className="h-16 flex items-center justify-center mb-2">
                      <div className="w-12 h-12 border border-[#5C3D8D] rounded-full"></div>
                    </div>
                    <h4 className="text-sm font-medium text-[#2E1A47]">Circular</h4>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de zonas creadas */}
        {eventData.seatingMap.sections.length > 0 && (
          <div className="border border-[#A28CD4]/20 rounded-lg p-4 mt-6">
            <h3 className="font-medium text-[#2E1A47] mb-4">Zonas configuradas</h3>
            <div className="space-y-4">
              {eventData.seatingMap.sections.map((section, index) => (
                <div key={index} className="border border-[#A28CD4]/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md" style={{ backgroundColor: section.color || "#5C3D8D" }}></div>
                      <h4 className="font-medium text-[#2E1A47]">Zona {index + 1}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSeatingSection(index)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Nombre de la zona" required>
                      <input
                        type="text"
                        value={section.name || ""}
                        onChange={(e) => handleSeatingSectionChange(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                        placeholder="Ej. Platea"
                      />
                    </FormField>

                    <FormField label="Capacidad" required>
                      <input
                        type="number"
                        value={section.capacity || 100}
                        onChange={(e) => handleSeatingSectionChange(index, "capacity", Number.parseInt(e.target.value))}
                        min="1"
                        className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                        placeholder="Ej. 100"
                      />
                    </FormField>

                    <FormField label="Tipo de entrada asociada" required>
                      {eventData.ticketTypes.length > 0 ? (
                        <select
                          value={section.ticketTypeId !== null ? section.ticketTypeId : ""}
                          onChange={(e) => {
                            const ticketTypeId = e.target.value ? Number.parseInt(e.target.value) : null
                            const selectedTicket = ticketTypeId !== null ? eventData.ticketTypes[ticketTypeId] : null

                            // Actualizar tanto el ticketTypeId como el precio automáticamente
                            handleSeatingSectionChange(index, "ticketTypeId", ticketTypeId)
                            if (selectedTicket) {
                              handleSeatingSectionChange(index, "price", selectedTicket.price)
                            }
                          }}
                          className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                        >
                          <option value="">Selecciona un tipo de entrada</option>
                          {eventData.ticketTypes.map((ticket, idx) => (
                            <option key={idx} value={idx}>
                              {ticket.name} ({ticket.price}€)
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center h-10 px-3 py-2 border border-[#A28CD4]/30 rounded-md bg-gray-50">
                          <span className="text-[#5C3D8D]/70">No hay tipos de entradas definidos</span>
                        </div>
                      )}
                    </FormField>

                    <FormField
                      label="Precio"
                      required={false}
                      tooltip="Se usa el precio del tipo de entrada seleccionado"
                    >
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#5C3D8D]/60 h-4 w-4" />
                        <input
                          type="text"
                          value={section.price || ""}
                          onChange={(e) => handleSeatingSectionChange(index, "price", e.target.value)}
                          className={`w-full pl-10 px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50 ${
                            section.ticketTypeId !== null ? "bg-gray-100" : ""
                          }`}
                          placeholder="Ej. 45.00"
                          disabled={section.ticketTypeId !== null}
                        />
                      </div>
                    </FormField>

                    <FormField label="Color" required tooltip="Color para identificar la zona en el mapa">
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={section.color || "#5C3D8D"}
                          onChange={(e) => handleSeatingSectionChange(index, "color", e.target.value)}
                          className="h-10 w-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={section.color || "#5C3D8D"}
                          onChange={(e) => handleSeatingSectionChange(index, "color", e.target.value)}
                          className="flex-grow px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                          placeholder="#RRGGBB"
                        />
                      </div>
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista previa simplificada */}
        {eventData.seatingMap.sections.length > 0 && (
          <div className="border border-[#A28CD4]/20 rounded-lg p-4">
            <h3 className="font-medium text-[#2E1A47] mb-4">Vista previa</h3>
            <div className="bg-[#F3F0FA] p-4 rounded-lg">
              <div className="flex flex-col items-center">
                <div className="w-full max-w-lg h-48 bg-white rounded-lg shadow-inner p-4 flex items-center justify-center">
                  <div className="w-full flex flex-wrap gap-4 justify-center">
                    {eventData.seatingMap.sections.map((section, index) => {
                      // Calcular tamaño basado en capacidad
                      const size = Math.min(Math.max(section.capacity / 50, 4), 12)
                      return (
                        <div key={index} className="flex flex-col items-center">
                          <div
                            className="rounded-md p-2 text-white text-xs font-medium"
                            style={{
                              backgroundColor: section.color || "#5C3D8D",
                              width: `${size * 10}px`,
                              height: `${size * 6}px`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <div className="text-center">
                              <div>{section.name}</div>
                              <div className="text-xs opacity-80">
                                {section.price ? `${section.price}€` : "Sin precio"}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs mt-1 text-[#5C3D8D]">{section.capacity} asientos</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="mt-4 text-sm text-[#5C3D8D]">
                  Esta es una vista simplificada. El mapa real tendrá todos los asientos individuales.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="light" className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10" onClick={onPrevious}>
          Volver a Entradas
        </Button>
        <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={onFinish}>
          Finalizar
        </Button>
      </div>
    </AccordionSection>
  )
}

export default SeatingSection
