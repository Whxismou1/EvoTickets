import { ArrowRight, Calendar, CreditCard, Globe, Ticket, Users } from "lucide-react"

const iconMap = {
  ArrowRight,
  Calendar,
  CreditCard,
  Globe,
  Ticket,
  Users,
}

export default function IconMapper({ name, className = "h-10 w-10" }) {
  const Icon = iconMap[name]

  if (!Icon) {
    return null
  }

  return <Icon className={className} />
}
