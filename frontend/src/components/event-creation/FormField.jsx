import { HelpCircle } from "lucide-react"

const FormField = ({ label, children, required = false, tooltip = null }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-1">
        <label className="block text-sm font-medium text-[#2E1A47]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltip && (
          <div className="relative ml-1 group">
            <HelpCircle className="h-4 w-4 text-[#5C3D8D]/60" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded-md shadow-md text-xs w-48 z-10">
              {tooltip}
            </div>
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

export default FormField
