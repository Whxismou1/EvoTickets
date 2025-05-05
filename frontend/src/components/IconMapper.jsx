import {
  ArrowRight,
  Calendar,
  CreditCard,
  Globe,
  Ticket,
  Users,
} from "lucide-react";
import PropTypes from "prop-types";

const iconMap = {
  ArrowRight,
  Calendar,
  CreditCard,
  Globe,
  Ticket,
  Users,
};

export default function IconMapper({ name, className = "h-10 w-10" }) {
  const Icon = iconMap[name];

  if (!Icon) {
    return null;
  }

  return <Icon className={className} />;
}

IconMapper.propTypes = {
  name: PropTypes.oneOf(Object.keys(iconMap)).isRequired,
  className: PropTypes.string,
};
