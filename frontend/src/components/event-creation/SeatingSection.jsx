"use client"

import { useState, useEffect } from "react"
import { MapPin, Plus, Trash2, Check, AlertCircle, Info } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"
import { useAlert } from "../../context/AlertContext"

const SeatingSection = ({ isOpen, toggleOpen, isCompleted, onPrevious, onFinish, eventData, setEventData }) => {
  const { error } = useAlert()
  const [activeTab, setActiveTab] = useState("venue")
  const [venueType, setVenueType] = useState(eventData.seatingMap?.template || "rectangular")
  const [editingZone, setEditingZone] = useState(null)
  const [zoneForm, setZoneForm] = useState({
    name: "",
    color: "#5C3D8D",
    rows: 10,
    seatsPerRow: 20,
    ticketTypeId: "",
  })
  const [showZoneForm, setShowZoneForm] = useState(false)
  const [validationError, setValidationError] = useState("")
  const [totalSeats, setTotalSeats] = useState(0)
  const [capacityExceeded, setCapacityExceeded] = useState(false)
  const [ticketTypeUsage, setTicketTypeUsage] = useState({})

  // Inicializar el estado de seatingMap si no existe
  useEffect(() => {
    if (!eventData.seatingMap) {
      setEventData({
        ...eventData,
        seatingMap: {
          template: "rectangular",
          zones: [],
        },
      })
    } else if (eventData.seatingMap.template) {
      setVenueType(eventData.seatingMap.template)
    }
  }, [eventData, setEventData])

  // Calcular el total de asientos y verificar si excede la capacidad
  useEffect(() => {
    if (!eventData.seatingMap?.zones) return

    const total = eventData.seatingMap.zones.reduce((sum, zone) => {
      return sum + zone.rows * zone.seatsPerRow
    }, 0)

    setTotalSeats(total)

    const capacity = Number.parseInt(eventData.capacity) || 0
    setCapacityExceeded(capacity > 0 && total > capacity)

    // Calcular el uso de cada tipo de entrada
    const usage = {}
    eventData.seatingMap.zones.forEach((zone) => {
      const zoneSeats = zone.rows * zone.seatsPerRow
      if (zone.ticketTypeId) {
        usage[zone.ticketTypeId] = (usage[zone.ticketTypeId] || 0) + zoneSeats
      }
    })
    setTicketTypeUsage(usage)
  }, [eventData.seatingMap?.zones, eventData.capacity])

  const handleVenueTypeChange = (type) => {
    setVenueType(type)
    setEventData({
      ...eventData,
      seatingMap: {
        ...eventData.seatingMap,
        template: type,
      },
    })
  }

  const handleAddZone = () => {
    setEditingZone(null)
    setZoneForm({
      name: "",
      color: "#5C3D8D",
      rows: 10,
      seatsPerRow: 20,
      ticketTypeId: eventData.tickets && eventData.tickets.length > 0 ? eventData.tickets[0].name : "",
    })
    setShowZoneForm(true)
    setActiveTab("zones")
    setValidationError("")
  }

  const handleEditZone = (index) => {
    const zone = eventData.seatingMap.zones[index]
    setEditingZone(index)
    setZoneForm({
      name: zone.name,
      color: zone.color,
      rows: zone.rows,
      seatsPerRow: zone.seatsPerRow,
      ticketTypeId: zone.ticketTypeId,
    })
    setShowZoneForm(true)
    setActiveTab("zones")
    setValidationError("")
  }

  const handleDeleteZone = (index) => {
    const newZones = [...eventData.seatingMap.zones]
    newZones.splice(index, 1)
    setEventData({
      ...eventData,
      seatingMap: {
        ...eventData.seatingMap,
        zones: newZones,
      },
    })
  }

  // Obtener el límite de entradas para un tipo de entrada específico
  const getTicketTypeLimit = (ticketTypeId) => {
    if (!eventData.tickets) return Number.POSITIVE_INFINITY
    const ticket = eventData.tickets.find((t) => t.name === ticketTypeId)
    return ticket && ticket.limit ? Number.parseInt(ticket.limit) : Number.POSITIVE_INFINITY
  }

  // Calcular cuántos asientos ya están asignados a un tipo de entrada específico (excluyendo la zona actual si está editando)
  const getTicketTypeUsage = (ticketTypeId) => {
    if (!eventData.seatingMap?.zones) return 0

    return eventData.seatingMap.zones.reduce((sum, zone, index) => {
      // Si estamos editando una zona, excluirla del cálculo
      if (editingZone !== null && index === editingZone) return sum

      if (zone.ticketTypeId === ticketTypeId) {
        return sum + zone.rows * zone.seatsPerRow
      }
      return sum
    }, 0)
  }

  // Calcular cuántos asientos quedan disponibles para un tipo de entrada
  const getRemainingTickets = (ticketTypeId) => {
    const limit = getTicketTypeLimit(ticketTypeId)
    const usage = getTicketTypeUsage(ticketTypeId)
    return Math.max(0, limit - usage)
  }

  const handleZoneFormChange = (field, value) => {
    // Si estamos cambiando el tipo de entrada, verificar si hay suficientes entradas disponibles
    if (field === "ticketTypeId") {
      const newTicketTypeId = value
      const limit = getTicketTypeLimit(newTicketTypeId)
      const usage = getTicketTypeUsage(newTicketTypeId)
      const currentZoneSeats = zoneForm.rows * zoneForm.seatsPerRow

      if (limit !== Number.POSITIVE_INFINITY && currentZoneSeats > limit - usage) {
        // Si no hay suficientes entradas, ajustar automáticamente el número de filas y asientos
        const remainingTickets = limit - usage

        if (remainingTickets <= 0) {
          error(`No quedan entradas disponibles del tipo ${newTicketTypeId}`)
          return
        }

        // Calcular nuevos valores para mantener la proporción pero sin exceder el límite
        let newRows = zoneForm.rows
        let newSeatsPerRow = zoneForm.seatsPerRow

        if (remainingTickets < currentZoneSeats) {
          // Intentar mantener la proporción
          const ratio = Math.sqrt(remainingTickets / currentZoneSeats)
          newRows = Math.max(1, Math.floor(zoneForm.rows * ratio))
          newSeatsPerRow = Math.max(1, Math.floor(zoneForm.seatsPerRow * ratio))

          // Ajustar si aún excede
          while (newRows * newSeatsPerRow > remainingTickets) {
            if (newRows > newSeatsPerRow) {
              newRows--
            } else {
              newSeatsPerRow--
            }
          }

          error(`Se han ajustado las dimensiones de la zona para no exceder el límite de entradas (${limit})`)

          setZoneForm({
            ...zoneForm,
            [field]: value,
            rows: newRows,
            seatsPerRow: newSeatsPerRow,
          })
          return
        }
      }
    }

    // Si estamos cambiando filas o asientos por fila
    if (field === "rows" || field === "seatsPerRow") {
      const ticketTypeId = zoneForm.ticketTypeId
      const limit = getTicketTypeLimit(ticketTypeId)
      const usage = getTicketTypeUsage(ticketTypeId)
      const remainingTickets = limit - usage

      const rows = field === "rows" ? Number.parseInt(value) || 0 : Number.parseInt(zoneForm.rows) || 0
      const seatsPerRow =
        field === "seatsPerRow" ? Number.parseInt(value) || 0 : Number.parseInt(zoneForm.seatsPerRow) || 0
      const totalSeats = rows * seatsPerRow

      // Verificar si excede el límite de entradas para este tipo
      if (limit !== Number.POSITIVE_INFINITY && totalSeats > remainingTickets) {
        // Calcular el valor máximo permitido
        if (field === "rows" && seatsPerRow > 0) {
          const maxRows = Math.floor(remainingTickets / seatsPerRow)
          value = Math.max(1, maxRows).toString()
          if (maxRows < 1) {
            error(`No hay suficientes entradas de tipo ${ticketTypeId} disponibles`)
          } else {
            error(`Se ha ajustado el número de filas para no exceder el límite de entradas (${limit})`)
          }
        } else if (field === "seatsPerRow" && rows > 0) {
          const maxSeatsPerRow = Math.floor(remainingTickets / rows)
          value = Math.max(1, maxSeatsPerRow).toString()
          if (maxSeatsPerRow < 1) {
            error(`No hay suficientes entradas de tipo ${ticketTypeId} disponibles`)
          } else {
            error(`Se ha ajustado el número de asientos por fila para no exceder el límite de entradas (${limit})`)
          }
        }
      }

      // Verificar si excede la capacidad total del lugar
      const capacity = Number.parseInt(eventData.capacity) || 0
      if (capacity > 0) {
        const otherZonesSeats =
          totalSeats -
          (editingZone !== null
            ? eventData.seatingMap.zones[editingZone].rows * eventData.seatingMap.zones[editingZone].seatsPerRow
            : 0)

        if (totalSeats > capacity - otherZonesSeats) {
          // Ajustar para no exceder la capacidad
          if (field === "rows" && seatsPerRow > 0) {
            const maxRows = Math.floor((capacity - otherZonesSeats) / seatsPerRow)
            value = Math.max(1, maxRows).toString()
            if (maxRows < 1) {
              error("No hay capacidad suficiente para añadir más asientos")
            }
          } else if (field === "seatsPerRow" && rows > 0) {
            const maxSeatsPerRow = Math.floor((capacity - otherZonesSeats) / rows)
            value = Math.max(1, maxSeatsPerRow).toString()
            if (maxSeatsPerRow < 1) {
              error("No hay capacidad suficiente para añadir más asientos")
            }
          }
        }
      }
    }

    setZoneForm({
      ...zoneForm,
      [field]: value,
    })
  }

  const handleSaveZone = () => {
    // Validar el formulario
    if (!zoneForm.name.trim()) {
      setValidationError("El nombre de la zona es obligatorio")
      return
    }

    if (!zoneForm.ticketTypeId) {
      setValidationError("Debes seleccionar un tipo de entrada")
      return
    }

    const rows = Number.parseInt(zoneForm.rows)
    const seatsPerRow = Number.parseInt(zoneForm.seatsPerRow)

    if (isNaN(rows) || rows <= 0) {
      setValidationError("El número de filas debe ser mayor que 0")
      return
    }

    if (isNaN(seatsPerRow) || seatsPerRow <= 0) {
      setValidationError("El número de asientos por fila debe ser mayor que 0")
      return
    }

    // Verificar si excede el límite de entradas para este tipo
    const ticketTypeId = zoneForm.ticketTypeId
    const limit = getTicketTypeLimit(ticketTypeId)
    const usage = getTicketTypeUsage(ticketTypeId)
    const zoneSeats = rows * seatsPerRow

    if (limit !== Number.POSITIVE_INFINITY && zoneSeats > limit - usage) {
      setValidationError(
        `Esta zona tiene ${zoneSeats} asientos, pero solo quedan ${limit - usage} entradas disponibles de tipo ${ticketTypeId}.`,
      )
      return
    }

    // Verificar si excede la capacidad total
    const capacity = Number.parseInt(eventData.capacity) || 0
    if (capacity > 0) {
      const otherZonesSeats =
        totalSeats -
        (editingZone !== null
          ? eventData.seatingMap.zones[editingZone].rows * eventData.seatingMap.zones[editingZone].seatsPerRow
          : 0)

      if (otherZonesSeats + zoneSeats > capacity) {
        setValidationError(
          `Esta zona tiene ${zoneSeats} asientos. El total de asientos (${otherZonesSeats + zoneSeats}) excederá la capacidad del lugar (${capacity}).`,
        )
        return
      }
    }

    // Guardar la zona
    const newZone = {
      name: zoneForm.name,
      color: zoneForm.color,
      rows: rows,
      seatsPerRow: seatsPerRow,
      ticketTypeId: zoneForm.ticketTypeId,
    }

    let newZones
    if (editingZone !== null) {
      newZones = [...eventData.seatingMap.zones]
      newZones[editingZone] = newZone
    } else {
      newZones = [...(eventData.seatingMap.zones || []), newZone]
    }

    setEventData({
      ...eventData,
      seatingMap: {
        ...eventData.seatingMap,
        zones: newZones,
      },
    })

    setShowZoneForm(false)
    setValidationError("")
  }

  const handleFinish = () => {
    // Validar que haya al menos una zona
    if (!eventData.seatingMap?.zones || eventData.seatingMap.zones.length === 0) {
      setValidationError("Debes crear al menos una zona")
      return
    }

    // Verificar si excede la capacidad
    if (capacityExceeded) {
      setValidationError(`El total de asientos (${totalSeats}) excede la capacidad del lugar (${eventData.capacity}).`)
      return
    }

    // Verificar que ningún tipo de entrada exceda su límite
    let ticketLimitExceeded = false
    let errorMessage = ""

    for (const ticketType of eventData.tickets) {
      const limit = Number.parseInt(ticketType.limit)
      if (!isNaN(limit) && limit > 0) {
        const usage = ticketTypeUsage[ticketType.name] || 0
        if (usage > limit) {
          ticketLimitExceeded = true
          errorMessage = `El tipo de entrada "${ticketType.name}" tiene asignados ${usage} asientos, pero su límite es ${limit}.`
          break
        }
      }
    }

    if (ticketLimitExceeded) {
      setValidationError(errorMessage)
      return
    }

    // Llamar a onFinish solo si la validación es exitosa
    setValidationError("")
    onFinish()
  }

  // Encontrar el precio del tipo de entrada seleccionado
  const getTicketPrice = (ticketTypeId) => {
    if (!eventData.tickets) return ""
    const ticket = eventData.tickets.find((t) => t.name === ticketTypeId)
    return ticket ? ticket.price : ""
  }

  return (
    <AccordionSection
      title="Mapa de asientos"
      icon={<MapPin className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      {/* Información de capacidad */}
      {Number.parseInt(eventData.capacity) > 0 && (
        <div
          className={`p-4 rounded-lg flex items-start gap-3 mb-6 ${
            capacityExceeded ? "bg-amber-50" : "bg-[#F3F0FA]/50"
          }`}
        >
          <Info className={`h-5 w-5 flex-shrink-0 mt-0.5 ${capacityExceeded ? "text-amber-500" : "text-[#5C3D8D]"}`} />
          <div>
            <p className={`text-sm ${capacityExceeded ? "text-amber-700" : "text-[#2E1A47]"}`}>
              {capacityExceeded
                ? `¡Atención! El total de asientos (${totalSeats}) excede la capacidad del lugar (${eventData.capacity}).`
                : `Capacidad del lugar: ${eventData.capacity} personas. Asientos configurados: ${totalSeats}.`}
            </p>
            {!capacityExceeded && (
              <p className="text-sm text-[#5C3D8D] mt-1">
                Capacidad restante: {Math.max(0, Number.parseInt(eventData.capacity) - totalSeats)} asientos
              </p>
            )}
          </div>
        </div>
      )}

      {/* Información de uso de tipos de entradas */}
      {Object.keys(ticketTypeUsage).length > 0 && (
        <div className="p-4 rounded-lg bg-[#F3F0FA]/50 mb-6">
          <h4 className="font-medium text-[#2E1A47] mb-2">Uso de entradas por tipo</h4>
          <div className="space-y-2">
            {eventData.tickets.map((ticket, index) => {
              const usage = ticketTypeUsage[ticket.name] || 0
              const limit = Number.parseInt(ticket.limit)
              const hasLimit = !isNaN(limit) && limit > 0
              const isExceeded = hasLimit && usage > limit

              return (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-[#2E1A47]">{ticket.name}:</span>
                  <span className={`text-sm font-medium ${isExceeded ? "text-red-600" : "text-[#5C3D8D]"}`}>
                    {usage} asientos asignados
                    {hasLimit && ` / ${limit} disponibles`}
                    {isExceeded && " ⚠️"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pestañas */}
      <div className="flex border-b border-[#A28CD4]/20 mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "venue"
              ? "text-[#5C3D8D] border-b-2 border-[#5C3D8D]"
              : "text-[#5C3D8D]/60 hover:text-[#5C3D8D]"
          }`}
          onClick={() => setActiveTab("venue")}
        >
          Tipo de recinto
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "zones"
              ? "text-[#5C3D8D] border-b-2 border-[#5C3D8D]"
              : "text-[#5C3D8D]/60 hover:text-[#5C3D8D]"
          }`}
          onClick={() => setActiveTab("zones")}
        >
          Zonas y precios
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === "preview"
              ? "text-[#5C3D8D] border-b-2 border-[#5C3D8D]"
              : "text-[#5C3D8D]/60 hover:text-[#5C3D8D]"
          }`}
          onClick={() => setActiveTab("preview")}
        >
          Vista previa
        </button>
      </div>

      {/* Contenido de las pestañas */}
      {activeTab === "venue" && (
        <div>
          <h3 className="font-medium text-[#2E1A47] mb-4">Selecciona el tipo de recinto</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                venueType === "rectangular"
                  ? "border-[#5C3D8D] bg-[#F3F0FA]/30"
                  : "border-[#A28CD4]/20 hover:border-[#A28CD4]/40"
              }`}
              onClick={() => handleVenueTypeChange("rectangular")}
            >
              <div className="aspect-video bg-[#F3F0FA] rounded-md mb-3 flex items-center justify-center">
                <div className="w-3/4 h-1/2 border-2 border-[#5C3D8D] rounded-md"></div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    venueType === "rectangular" ? "bg-[#5C3D8D]" : "border border-[#A28CD4]"
                  }`}
                >
                  {venueType === "rectangular" && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="font-medium text-[#2E1A47]">Rectangular</span>
              </div>
              <p className="text-xs text-[#5C3D8D] mt-1">Ideal para teatros y salas de conciertos</p>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                venueType === "circular"
                  ? "border-[#5C3D8D] bg-[#F3F0FA]/30"
                  : "border-[#A28CD4]/20 hover:border-[#A28CD4]/40"
              }`}
              onClick={() => handleVenueTypeChange("circular")}
            >
              <div className="aspect-video bg-[#F3F0FA] rounded-md mb-3 flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-full border-2 border-[#5C3D8D]"></div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    venueType === "circular" ? "bg-[#5C3D8D]" : "border border-[#A28CD4]"
                  }`}
                >
                  {venueType === "circular" && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="font-medium text-[#2E1A47]">Circular</span>
              </div>
              <p className="text-xs text-[#5C3D8D] mt-1">Ideal para eventos en 360°</p>
            </div>

            <div
              className={`border rounded-lg p-4 cursor-pointer ${
                venueType === "semicircular"
                  ? "border-[#5C3D8D] bg-[#F3F0FA]/30"
                  : "border-[#A28CD4]/20 hover:border-[#A28CD4]/40"
              }`}
              onClick={() => handleVenueTypeChange("semicircular")}
            >
              <div className="aspect-video bg-[#F3F0FA] rounded-md mb-3 flex items-center justify-center">
                <div className="w-1/2 h-1/2 rounded-t-full border-2 border-[#5C3D8D]"></div>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                    venueType === "semicircular" ? "bg-[#5C3D8D]" : "border border-[#A28CD4]"
                  }`}
                >
                  {venueType === "semicircular" && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="font-medium text-[#2E1A47]">Semicircular</span>
              </div>
              <p className="text-xs text-[#5C3D8D] mt-1">Ideal para anfiteatros</p>
            </div>
          </div>

          <Button
            type="button"
            className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
            onClick={() => setActiveTab("zones")}
          >
            Continuar a Zonas
          </Button>
        </div>
      )}

      {activeTab === "zones" && (
        <div>
          {showZoneForm ? (
            <div className="border border-[#A28CD4]/20 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-[#2E1A47] mb-4">
                {editingZone !== null ? "Editar zona" : "Añadir nueva zona"}
              </h3>

              {validationError && (
                <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{validationError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nombre de la zona" required>
                  <input
                    type="text"
                    value={zoneForm.name}
                    onChange={(e) => handleZoneFormChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                    placeholder="Ej. Zona A"
                  />
                </FormField>

                <FormField label="Color" required>
                  <div className="flex items-center">
                    <input
                      type="color"
                      value={zoneForm.color}
                      onChange={(e) => handleZoneFormChange("color", e.target.value)}
                      className="h-10 w-10 rounded-md border border-[#A28CD4]/30 mr-2"
                    />
                    <input
                      type="text"
                      value={zoneForm.color}
                      onChange={(e) => handleZoneFormChange("color", e.target.value)}
                      className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                      placeholder="#5C3D8D"
                    />
                  </div>
                </FormField>

                <FormField label="Tipo de entrada" required>
                  {eventData.tickets && eventData.tickets.length > 0 ? (
                    <select
                      value={zoneForm.ticketTypeId}
                      onChange={(e) => handleZoneFormChange("ticketTypeId", e.target.value)}
                      className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                    >
                      <option value="">Selecciona un tipo de entrada</option>
                      {eventData.tickets.map((ticket, index) => {
                        const limit = Number.parseInt(ticket.limit)
                        const usage = getTicketTypeUsage(ticket.name)
                        const remaining = !isNaN(limit) && limit > 0 ? limit - usage : "∞"
                        const isAvailable = isNaN(limit) || limit === 0 || usage < limit

                        return (
                          <option key={index} value={ticket.name} disabled={!isAvailable}>
                            {ticket.name} - {ticket.price}€{" "}
                            {!isNaN(limit) && limit > 0 ? `(${remaining} disponibles)` : ""}
                          </option>
                        )
                      })}
                    </select>
                  ) : (
                    <div className="bg-amber-50 text-amber-700 p-3 rounded-md flex items-start">
                      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">
                        No hay tipos de entradas definidos. Por favor, vuelve a la sección de Entradas y crea al menos
                        un tipo.
                      </p>
                    </div>
                  )}
                </FormField>

                {zoneForm.ticketTypeId && (
                  <div className="md:col-span-2 bg-[#F3F0FA]/50 p-3 rounded-md">
                    <p className="text-sm text-[#5C3D8D] mb-2">
                      <strong>Información del tipo de entrada:</strong>
                    </p>
                    {(() => {
                      const ticket = eventData.tickets.find((t) => t.name === zoneForm.ticketTypeId)
                      const limit = ticket ? Number.parseInt(ticket.limit) : null
                      const usage = getTicketTypeUsage(zoneForm.ticketTypeId)
                      const remaining = !isNaN(limit) && limit > 0 ? limit - usage : "∞"

                      return (
                        <div className="space-y-1">
                          <p className="text-sm text-[#2E1A47]">
                            <span className="font-medium">Precio:</span> {ticket?.price}€
                          </p>
                          {!isNaN(limit) && limit > 0 && (
                            <p className="text-sm text-[#2E1A47]">
                              <span className="font-medium">Límite:</span> {limit} entradas
                            </p>
                          )}
                          <p className="text-sm text-[#2E1A47]">
                            <span className="font-medium">Asientos ya asignados:</span> {usage}
                          </p>
                          <p className="text-sm text-[#2E1A47]">
                            <span className="font-medium">Entradas disponibles:</span> {remaining}
                          </p>
                        </div>
                      )
                    })()}
                  </div>
                )}

                <FormField
                  label="Número de filas"
                  required
                  tooltip={
                    zoneForm.ticketTypeId
                      ? `Máximo: ${Math.floor(getRemainingTickets(zoneForm.ticketTypeId) / (Number.parseInt(zoneForm.seatsPerRow) || 1))} filas con los asientos actuales`
                      : undefined
                  }
                >
                  <input
                    type="number"
                    value={zoneForm.rows}
                    onChange={(e) => handleZoneFormChange("rows", e.target.value)}
                    min="1"
                    max={
                      zoneForm.ticketTypeId && zoneForm.seatsPerRow
                        ? Math.floor(
                            getRemainingTickets(zoneForm.ticketTypeId) / (Number.parseInt(zoneForm.seatsPerRow) || 1),
                          )
                        : undefined
                    }
                    className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                    placeholder="Ej. 10"
                  />
                </FormField>

                <FormField
                  label="Asientos por fila"
                  required
                  tooltip={
                    zoneForm.ticketTypeId
                      ? `Máximo: ${Math.floor(getRemainingTickets(zoneForm.ticketTypeId) / (Number.parseInt(zoneForm.rows) || 1))} asientos por fila con las filas actuales`
                      : undefined
                  }
                >
                  <input
                    type="number"
                    value={zoneForm.seatsPerRow}
                    onChange={(e) => handleZoneFormChange("seatsPerRow", e.target.value)}
                    min="1"
                    max={
                      zoneForm.ticketTypeId && zoneForm.rows
                        ? Math.floor(getRemainingTickets(zoneForm.ticketTypeId) / (Number.parseInt(zoneForm.rows) || 1))
                        : undefined
                    }
                    className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                    placeholder="Ej. 20"
                  />
                </FormField>

                <div className="md:col-span-2">
                  <p className="text-sm text-[#5C3D8D] mb-2">
                    Total de asientos en esta zona: <strong>{zoneForm.rows * zoneForm.seatsPerRow}</strong>
                  </p>

                  {zoneForm.ticketTypeId && (
                    <div>
                      {(() => {
                        const limit = getTicketTypeLimit(zoneForm.ticketTypeId)
                        const usage = getTicketTypeUsage(zoneForm.ticketTypeId)
                        const zoneSeats = zoneForm.rows * zoneForm.seatsPerRow
                        const remaining = limit - usage
                        const isExceeded = limit !== Number.POSITIVE_INFINITY && zoneSeats > remaining

                        return isExceeded ? (
                          <p className="text-sm text-red-600">
                            ⚠️ Esta configuración excede el límite de entradas disponibles para {zoneForm.ticketTypeId}{" "}
                            (disponibles: {remaining})
                          </p>
                        ) : (
                          limit !== Number.POSITIVE_INFINITY && (
                            <p className="text-sm text-[#5C3D8D]">
                              Entradas restantes después de esta asignación: <strong>{remaining - zoneSeats}</strong> de{" "}
                              {limit}
                            </p>
                          )
                        )
                      })()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-4 space-x-3">
                <Button
                  type="button"
                  variant="light"
                  className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
                  onClick={() => {
                    setShowZoneForm(false)
                    setValidationError("")
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                  onClick={handleSaveZone}
                  disabled={!eventData.tickets || eventData.tickets.length === 0}
                >
                  Guardar zona
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-[#2E1A47]">Zonas configuradas</h3>
                <Button
                  type="button"
                  className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                  startContent={<Plus size={16} />}
                  onClick={handleAddZone}
                  disabled={!eventData.tickets || eventData.tickets.length === 0}
                >
                  Añadir zona
                </Button>
              </div>

              {eventData.tickets && eventData.tickets.length === 0 && (
                <div className="bg-amber-50 text-amber-700 p-4 rounded-md mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">No hay tipos de entradas definidos</p>
                    <p className="text-sm mt-1">
                      Debes crear al menos un tipo de entrada en la sección anterior antes de configurar las zonas.
                    </p>
                  </div>
                </div>
              )}

              {eventData.seatingMap?.zones && eventData.seatingMap.zones.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {eventData.seatingMap.zones.map((zone, index) => {
                    const ticketPrice = getTicketPrice(zone.ticketTypeId)
                    const limit = getTicketTypeLimit(zone.ticketTypeId)
                    const usage = ticketTypeUsage[zone.ticketTypeId] || 0
                    const zoneSeats = zone.rows * zone.seatsPerRow
                    const isExceeded = limit !== Number.POSITIVE_INFINITY && usage > limit

                    return (
                      <div
                        key={index}
                        className={`border rounded-lg p-4 hover:border-[#A28CD4]/40 transition-colors ${
                          isExceeded ? "border-red-300 bg-red-50/30" : "border-[#A28CD4]/20"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: zone.color }}></div>
                            <div>
                              <h4 className="font-medium text-[#2E1A47]">{zone.name}</h4>
                              <p className="text-sm text-[#5C3D8D]">
                                {zone.rows} filas × {zone.seatsPerRow} asientos = {zoneSeats} asientos
                              </p>
                              <p className="text-sm font-medium text-[#2E1A47] mt-1">
                                Tipo: {zone.ticketTypeId} {ticketPrice && `- ${ticketPrice}€`}
                              </p>
                              {isExceeded && (
                                <p className="text-xs text-red-600 mt-1">
                                  ⚠️ Excede el límite de entradas disponibles ({limit})
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleEditZone(index)}
                              className="p-1.5 text-[#5C3D8D] hover:bg-[#5C3D8D]/10 rounded-md"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteZone(index)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#A28CD4]/30 rounded-lg p-6 text-center mb-6">
                  <p className="text-[#5C3D8D] mb-2">No hay zonas configuradas</p>
                  <Button
                    type="button"
                    className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                    startContent={<Plus size={16} />}
                    onClick={handleAddZone}
                    disabled={!eventData.tickets || eventData.tickets.length === 0}
                  >
                    Añadir zona
                  </Button>
                </div>
              )}
            </>
          )}

          {validationError && !showZoneForm && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{validationError}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="light"
              className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
              onClick={() => setActiveTab("venue")}
            >
              Volver a Tipo de recinto
            </Button>
            <Button
              type="button"
              className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
              onClick={() => setActiveTab("preview")}
            >
              Continuar a Vista previa
            </Button>
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div>
          <h3 className="font-medium text-[#2E1A47] mb-4">Vista previa del mapa de asientos</h3>

          {eventData.seatingMap?.zones && eventData.seatingMap.zones.length > 0 ? (
            <div className="mb-6">
              <div className="bg-[#F3F0FA]/50 p-4 rounded-lg mb-4">
                <div className="aspect-video bg-white rounded-lg border border-[#A28CD4]/20 flex items-center justify-center">
                  {/* Vista previa según el tipo de recinto */}
                  {venueType === "rectangular" && (
                    <div className="w-3/4 h-1/2 relative flex flex-col items-center">
                      <div className="w-full h-6 bg-[#2E1A47] rounded-t-md mb-2 flex items-center justify-center">
                        <span className="text-xs text-white">ESCENARIO</span>
                      </div>
                      <div className="flex-1 w-full flex flex-wrap gap-2 justify-center">
                        {eventData.seatingMap.zones.map((zone, index) => (
                          <div
                            key={index}
                            className="h-full rounded-md flex items-center justify-center p-2"
                            style={{ backgroundColor: zone.color, width: `${90 / eventData.seatingMap.zones.length}%` }}
                          >
                            <span className="text-xs text-white font-medium">{zone.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {venueType === "circular" && (
                    <div className="relative">
                      <div className="w-48 h-48 rounded-full border-2 border-[#2E1A47] flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#2E1A47] flex items-center justify-center">
                          <span className="text-[8px] text-white text-center">ESCENARIO</span>
                        </div>
                        {eventData.seatingMap.zones.map((zone, index) => {
                          const size = 48 - index * (48 / eventData.seatingMap.zones.length)
                          const offset = (48 - size) / 2
                          return (
                            <div
                              key={index}
                              className="absolute rounded-full flex items-center justify-center"
                              style={{
                                backgroundColor: zone.color,
                                width: `${size}%`,
                                height: `${size}%`,
                                top: `${offset}%`,
                                left: `${offset}%`,
                                zIndex: -index - 1,
                              }}
                            >
                              <span className="text-[8px] text-white font-medium">{zone.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {venueType === "semicircular" && (
                    <div className="relative">
                      <div className="w-64 h-32 relative flex flex-col items-center">
                        <div className="w-full h-6 bg-[#2E1A47] mb-2 flex items-center justify-center">
                          <span className="text-xs text-white">ESCENARIO</span>
                        </div>
                        <div className="w-full h-24 overflow-hidden relative">
                          {eventData.seatingMap.zones.map((zone, index) => {
                            const size = 100 - index * (100 / eventData.seatingMap.zones.length)
                            const offset = (100 - size) / 2
                            return (
                              <div
                                key={index}
                                className="absolute rounded-t-full flex items-center justify-center"
                                style={{
                                  backgroundColor: zone.color,
                                  width: `${size}%`,
                                  height: `${size * 2}%`,
                                  bottom: "0",
                                  left: `${offset}%`,
                                  zIndex: -index - 1,
                                }}
                              >
                                <span className="text-[8px] text-white font-medium mt-2">{zone.name}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-[#F3F0FA]/50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-[#2E1A47] mb-2">Leyenda</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {eventData.seatingMap.zones.map((zone, index) => {
                    const ticketPrice = getTicketPrice(zone.ticketTypeId)
                    const limit = getTicketTypeLimit(zone.ticketTypeId)
                    const usage = ticketTypeUsage[zone.ticketTypeId] || 0
                    const isExceeded = limit !== Number.POSITIVE_INFINITY && usage > limit

                    return (
                      <div key={index} className="flex items-center">
                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: zone.color }}></div>
                        <span className={`text-sm ${isExceeded ? "text-red-600" : "text-[#2E1A47]"}`}>
                          {zone.name} - {zone.ticketTypeId} {ticketPrice && `(${ticketPrice}€)`} -{" "}
                          {zone.rows * zone.seatsPerRow} asientos
                          {isExceeded && " ⚠️"}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="bg-[#F3F0FA]/50 p-4 rounded-lg mb-6">
                <h4 className="font-medium text-[#2E1A47] mb-2">Resumen</h4>
                <p className="text-sm text-[#5C3D8D]">
                  Tipo de recinto:{" "}
                  <span className="font-medium text-[#2E1A47]">
                    {venueType === "rectangular"
                      ? "Rectangular"
                      : venueType === "circular"
                        ? "Circular"
                        : "Semicircular"}
                  </span>
                </p>
                <p className="text-sm text-[#5C3D8D]">
                  Número de zonas:{" "}
                  <span className="font-medium text-[#2E1A47]">{eventData.seatingMap.zones.length}</span>
                </p>
                <p className="text-sm text-[#5C3D8D]">
                  Total de asientos: <span className="font-medium text-[#2E1A47]">{totalSeats}</span>
                </p>

                {/* Mostrar advertencias si hay problemas */}
                {capacityExceeded && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ El total de asientos excede la capacidad del lugar ({eventData.capacity}).
                  </p>
                )}

                {Object.entries(ticketTypeUsage).some(([type, usage]) => {
                  const limit = getTicketTypeLimit(type)
                  return limit !== Number.POSITIVE_INFINITY && usage > limit
                }) && (
                  <p className="text-sm text-red-600 mt-2">⚠️ Hay tipos de entradas que exceden su límite disponible.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-[#A28CD4]/30 rounded-lg p-6 text-center mb-6">
              <p className="text-[#5C3D8D] mb-2">No hay zonas configuradas para mostrar</p>
              <Button
                type="button"
                className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white"
                onClick={() => setActiveTab("zones")}
              >
                Configurar zonas
              </Button>
            </div>
          )}

          {validationError && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{validationError}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="light"
              className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
              onClick={() => setActiveTab("zones")}
            >
              Volver a Zonas
            </Button>
            <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={handleFinish}>
              Finalizar
            </Button>
          </div>
        </div>
      )}
    </AccordionSection>
  )
}

export default SeatingSection
