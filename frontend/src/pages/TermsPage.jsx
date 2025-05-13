"use client"

import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import { useTranslation } from "react-i18next"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"
import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

export default function TermsPage() {
  const { t } = useTranslation()
  const { alert, showAlert, hideAlert } = useAlert()

  return (
    <>
      <Nav />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-[calc(100vh-128px)] mt-16 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="bg-white p-8 rounded-xl shadow-lg border border-[#A28CD4]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-[#5C3D8D] hover:text-[#2E1A47] transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al inicio
              </Link>
            </div>
            
            <div className="flex flex-col items-center mb-8 text-center">
              <FileText className="h-12 w-12 text-[#5C3D8D] mb-2" />
              <h1 className="text-3xl font-bold text-[#2E1A47] mb-2">Términos y Condiciones</h1>
              <p className="text-[#5C3D8D] max-w-2xl">Última actualización: 12 de mayo de 2025</p>
            </div>

            <div className="space-y-6 text-[#2E1A47]/80">
              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">1. Introducción</h2>
                <p>
                  Estos Términos y Condiciones ("Términos") rigen el uso de la plataforma EvoTickets (la "Plataforma"),
                  operada por EvoTickets S.L. Al acceder o utilizar nuestra Plataforma, usted acepta estar sujeto a
                  estos Términos. Si no está de acuerdo con estos Términos, por favor, no utilice nuestra Plataforma.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">2. Definiciones</h2>
                <p>
                  <strong>"Usuario"</strong>: Cualquier persona que acceda, navegue o utilice la Plataforma.
                </p>
                <p>
                  <strong>"Organizador"</strong>: Usuario que crea y gestiona eventos en la Plataforma.
                </p>
                <p>
                  <strong>"Asistente"</strong>: Usuario que compra entradas para eventos a través de la Plataforma.
                </p>
                <p>
                  <strong>"Contenido"</strong>: Incluye, pero no se limita a, texto, gráficos, logotipos, imágenes,
                  audio, video, software y otros materiales.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">3. Registro de cuenta</h2>
                <p>
                  Para acceder a ciertas funciones de la Plataforma, es posible que deba registrarse y crear una cuenta.
                  Usted es responsable de mantener la confidencialidad de su información de cuenta y contraseña, y de
                  restringir el acceso a su dispositivo. Usted acepta la responsabilidad por todas las actividades que
                  ocurran bajo su cuenta.
                </p>
                <p>
                  Nos reservamos el derecho de cerrar cuentas y eliminar o editar contenido si consideramos que un
                  usuario ha violado estos Términos.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">4. Compra de entradas</h2>
                <p>Al comprar entradas a través de nuestra Plataforma, usted acepta:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Proporcionar información precisa y completa para la compra.</li>
                  <li>Pagar el precio total indicado, incluidas las tarifas de servicio aplicables.</li>
                  <li>Que las entradas están sujetas a disponibilidad.</li>
                  <li>
                    Que las entradas no son reembolsables, excepto en los casos especificados por la ley o por la
                    política del Organizador.
                  </li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">5. Organización de eventos</h2>
                <p>Los Organizadores son responsables de:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Proporcionar información precisa y completa sobre sus eventos.</li>
                  <li>Cumplir con todas las leyes y regulaciones aplicables.</li>
                  <li>Obtener todos los permisos y licencias necesarios para sus eventos.</li>
                  <li>Gestionar la política de reembolsos y cancelaciones de sus eventos.</li>
                </ul>
                <p>
                  EvoTickets no es responsable de la calidad, seguridad, legalidad o cualquier otro aspecto de los
                  eventos listados en nuestra Plataforma.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">6. Propiedad intelectual</h2>
                <p>
                  Todo el Contenido incluido en la Plataforma, como texto, gráficos, logotipos, iconos, imágenes, clips
                  de audio, descargas digitales y compilaciones de datos, es propiedad de EvoTickets o de sus
                  proveedores de contenido y está protegido por las leyes internacionales de derechos de autor.
                </p>
                <p>
                  No puede reproducir, distribuir, modificar, crear trabajos derivados, exhibir públicamente, ejecutar
                  públicamente, republicar, descargar, almacenar o transmitir cualquier material de nuestra Plataforma,
                  excepto según lo permitido por estos Términos.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">7. Limitación de responsabilidad</h2>
                <p>
                  En ningún caso EvoTickets, sus directores, empleados, socios, agentes, proveedores o afiliados serán
                  responsables por cualquier daño indirecto, incidental, especial, consecuente o punitivo, incluyendo
                  sin limitación, pérdida de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles,
                  resultantes de:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Su acceso o uso o incapacidad para acceder o usar la Plataforma.</li>
                  <li>Cualquier conducta o contenido de terceros en la Plataforma.</li>
                  <li>Cualquier contenido obtenido de la Plataforma.</li>
                  <li>Acceso no autorizado, uso o alteración de sus transmisiones o contenido.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">8. Modificaciones</h2>
                <p>
                  Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en
                  cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 30
                  días de anticipación antes de que los nuevos términos entren en vigor. Lo que constituye un cambio
                  material será determinado a nuestra sola discreción.
                </p>
                <p>
                  Al continuar accediendo o utilizando nuestra Plataforma después de que esas revisiones entren en
                  vigor, usted acepta estar sujeto a los términos revisados.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">9. Ley aplicable</h2>
                <p>
                  Estos Términos se regirán e interpretarán de acuerdo con las leyes de España, sin tener en cuenta sus
                  disposiciones sobre conflictos de leyes.
                </p>
                <p>
                  Nuestra falta de hacer cumplir cualquier derecho o disposición de estos Términos no se considerará una
                  renuncia a esos derechos. Si alguna disposición de estos Términos es considerada inválida o
                  inaplicable por un tribunal, las disposiciones restantes de estos Términos permanecerán en vigor.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-xl font-semibold text-[#2E1A47]">10. Contacto</h2>
                <p>Si tiene alguna pregunta sobre estos Términos, por favor contáctenos en:</p>
                <p className="font-medium">
                  legal@evotickets.com
                  <br />
                  EvoTickets S.L.
                  <br />
                  Calle Principal 123
                  <br />
                  28001 Madrid, España
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  )
}
