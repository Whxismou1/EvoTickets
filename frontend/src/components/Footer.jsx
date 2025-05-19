import { Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const socialLinks = [
  { name: "twitter", href: "#" },
  { name: "facebook", href: "#" },
  { name: "instagram", href: "#" },
  { name: "linkedin", href: "#" },
];

export default function Footer() {
  const { t } = useTranslation(); 
  const navigate = useNavigate();

  const footerSections = [
    {
      title: t("footer_events"),
      links: [
        { label: t("footer_links.music"), href: "#" },
        { label: t("footer_links.sports"), href: "#" },
        { label: t("footer_links.arts"), href: "#" },
        { label: t("footer_links.tech"), href: "#" },
        { label: t("footer_links.food"), href: "#" },
      ],
    },
    {
      title: t("footer_company"),
      links: [
        { label: t("footer_links.about"), href: "/AboutUsPage" },
        { label: t("footer_links.workWithUs"), href: "/WorkWithUsPage" },
      ],
    },
    {
      title: t("footer_support"),
      links: [
        { label: t("footer_links.help"), href: "/HelpCenterPage" },
        { label: t("footer_links.contact"), href: "/ContactPage" },
        { label: t("footer_links.privacy"), href: "/PrivacyPolicyPage" },
        { label: t("footer_links.terms"), href: "/TermsPage" },
      ],
    },
  ];

  return (
    <footer className="bg-[#2E1A47] text-[#F3F0FA] py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sección de la marca */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Ticket className="h-8 w-8 text-[#D7A6F3]" />
              <span className="text-xl font-bold text-white">EvoTickets</span>
            </div>
            <p className="text-[#A28CD4] mb-4">
              {t("footer_description")}
            </p>
            {/* Enlaces de redes sociales */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="bg-[#5C3D8D] hover:bg-[#A28CD4] transition-colors p-2 rounded-full"
                >
                  <span className="sr-only">{social.name}</span>
                  <div className="h-5 w-5 bg-[#D7A6F3] rounded-full" />
                </a>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-bold text-lg mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        navigate(link.href);
                        window.scrollTo(0,0);
                      }}
                      className="text-[#A28CD4] hover:text-[#D7A6F3] transition-colors text-left bg-transparent border-none p-0 m-0 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[#5C3D8D] mt-12 pt-8 text-center text-[#A28CD4]">
          <p>
            © {new Date().getFullYear()} EvoTickets. {t("footer_rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
