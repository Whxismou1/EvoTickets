"use client"

import { HelpCircle, Plus, Trash2 } from "lucide-react"
import { Button } from "@heroui/button"
import AccordionSection from "./AccordionSection"
import FormField from "./FormField"

const FaqsSection = ({ isOpen, toggleOpen, isCompleted, onPrevious, onNext, eventData, setEventData }) => {
  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...eventData.faqs]
    newFaqs[index] = { ...newFaqs[index], [field]: value }
    setEventData({ ...eventData, faqs: newFaqs })
  }

  const addFaq = () => {
    setEventData({
      ...eventData,
      faqs: [...eventData.faqs, { question: "", answer: "" }],
    })
  }

  const removeFaq = (index) => {
    const newFaqs = [...eventData.faqs]
    newFaqs.splice(index, 1)
    setEventData({ ...eventData, faqs: newFaqs })
  }

  return (
    <AccordionSection
      title="Preguntas frecuentes"
      icon={<HelpCircle className="h-5 w-5 text-[#5C3D8D]" />}
      isOpen={isOpen}
      toggleOpen={toggleOpen}
      isCompleted={isCompleted}
    >
      <div className="space-y-4">
        {eventData.faqs.map((faq, index) => (
          <div key={index} className="border border-[#A28CD4]/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-[#2E1A47]">Pregunta {index + 1}</h3>
              <button
                type="button"
                onClick={() => removeFaq(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded-md"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <FormField label="Pregunta" required>
              <input
                type="text"
                value={faq.question || ""}
                onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                placeholder="Ej. ¿Hay zona de acampada?"
              />
            </FormField>

            <FormField label="Respuesta" required>
              <textarea
                value={faq.answer || ""}
                onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                rows="3"
                className="w-full px-3 py-2 border border-[#A28CD4]/30 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5C3D8D]/50"
                placeholder="Respuesta detallada a la pregunta"
              ></textarea>
            </FormField>
          </div>
        ))}

        <button
          type="button"
          onClick={addFaq}
          className="w-full py-3 border-2 border-dashed border-[#A28CD4]/40 rounded-lg flex items-center justify-center text-[#5C3D8D] hover:bg-[#F3F0FA] transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" /> Añadir pregunta frecuente
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="light" className="text-[#5C3D8D] hover:bg-[#5C3D8D]/10" onClick={onPrevious}>
          Volver a Galería
        </Button>
        <Button type="button" className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white" onClick={onNext}>
          Siguiente: Entradas
        </Button>
      </div>
    </AccordionSection>
  )
}

export default FaqsSection
