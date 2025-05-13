"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@heroui/button"
import { Link } from "react-router-dom"
import Nav from "../components/Navbar"
import Footer from "../components/Footer"
import useAlert from "../hooks/useAlert"
import Alert from "../components/Alert"

export default function PrivacyPolicyPage() {
  const { alert, showAlert, hideAlert } = useAlert()

  return (
    <>
      <Nav />
      <Alert type={alert.type} message={alert.message} isVisible={alert.isVisible} onClose={hideAlert} />

      <div className="min-h-screen bg-[#F9F7FD] pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="mb-6">
              <Link to="/" className="inline-flex items-center text-[#5C3D8D] hover:text-[#2E1A47] transition-colors">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver al inicio
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-[#2E1A47] mb-6">Política de Privacidad</h1>
            <p className="text-[#5C3D8D] mb-6">Última actualización: 15 de mayo de 2023</p>

            <div className="prose prose-purple max-w-none text-[#5C3D8D]">
              <p>
                En EvoTickets, accesible desde www.evotickets.com, una de nuestras principales prioridades es la
                privacidad de nuestros visitantes. Este documento de Política de Privacidad contiene los tipos de
                información que se recopilan y registran por EvoTickets y cómo la utilizamos.
              </p>

              <p>
                Si tienes preguntas adicionales o requieres más información sobre nuestra Política de Privacidad, no
                dudes en contactarnos.
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">1. Información que recopilamos</h2>

              <h3 className="text-lg font-medium text-[#2E1A47] mt-6 mb-3">1.1 Información personal</h3>
              <p>Cuando te registras en nuestro sitio, podemos recopilar la siguiente información:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Nombre y apellidos</li>
                <li>Dirección de correo electrónico</li>
                <li>Número de teléfono</li>
                <li>Dirección de facturación y envío</li>
                <li>Información de pago (procesada de forma segura a través de nuestros proveedores de pago)</li>
                <li>Cualquier otra información que decidas proporcionarnos</li>
              </ul>

              <h3 className="text-lg font-medium text-[#2E1A47] mt-6 mb-3">1.2 Información de uso</h3>
              <p>También podemos recopilar información sobre cómo accedes y utilizas nuestro sitio web:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Dirección IP</li>
                <li>Tipo de navegador</li>
                <li>Páginas visitadas</li>
                <li>Tiempo de acceso</li>
                <li>Tiempo dedicado en cada página</li>
                <li>Clicks en enlaces</li>
                <li>Otros datos de diagnóstico</li>
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">2. Cómo utilizamos tu información</h2>
              <p>Utilizamos la información recopilada para diversos fines:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Proporcionar y mantener nuestro servicio</li>
                <li>Notificarte sobre cambios en nuestro servicio</li>
                <li>Permitirte participar en funciones interactivas de nuestro servicio cuando decidas hacerlo</li>
                <li>Proporcionar atención al cliente</li>
                <li>Recopilar análisis o información valiosa para mejorar nuestro servicio</li>
                <li>Monitorear el uso de nuestro servicio</li>
                <li>Detectar, prevenir y abordar problemas técnicos</li>
                <li>Procesar tus transacciones</li>
                <li>
                  Enviarte información sobre eventos que puedan interesarte, siempre que hayas dado tu consentimiento
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">
                3. Cookies y tecnologías de seguimiento
              </h2>
              <p>
                Utilizamos cookies y tecnologías de seguimiento similares para rastrear la actividad en nuestro servicio
                y almacenar cierta información. Las cookies son archivos con una pequeña cantidad de datos que pueden
                incluir un identificador único anónimo.
              </p>

              <p>
                Puedes indicar a tu navegador que rechace todas las cookies o que te avise cuando se envía una cookie.
                Sin embargo, si no aceptas cookies, es posible que no puedas utilizar algunas partes de nuestro
                servicio.
              </p>

              <p>Utilizamos los siguientes tipos de cookies:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento del sitio web.
                </li>
                <li>
                  <strong>Cookies de preferencias:</strong> Permiten recordar información que cambia el comportamiento o
                  el aspecto del sitio.
                </li>
                <li>
                  <strong>Cookies estadísticas:</strong> Ayudan a entender cómo los visitantes interactúan con el sitio.
                </li>
                <li>
                  <strong>Cookies de marketing:</strong> Utilizadas para rastrear a los visitantes en los sitios web con
                  el fin de mostrar anuncios relevantes.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">4. Compartir tu información personal</h2>
              <p>Podemos compartir tu información personal en las siguientes situaciones:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>Con proveedores de servicios:</strong> Para monitorear y analizar el uso de nuestro servicio,
                  para contactarte.
                </li>
                <li>
                  <strong>Con organizadores de eventos:</strong> Cuando compras entradas para un evento, compartimos la
                  información necesaria con los organizadores para facilitar tu acceso al evento.
                </li>
                <li>
                  <strong>Para transferencias comerciales:</strong> Podemos compartir o transferir tu información en
                  relación con, o durante las negociaciones de, cualquier fusión, venta de activos de la empresa,
                  financiación o adquisición.
                </li>
                <li>
                  <strong>Con afiliados:</strong> Podemos compartir tu información con nuestros afiliados, en cuyo caso
                  exigiremos a esos afiliados que respeten esta Política de Privacidad.
                </li>
                <li>
                  <strong>Con socios comerciales:</strong> Podemos compartir tu información con nuestros socios
                  comerciales para ofrecerte ciertos productos, servicios o promociones.
                </li>
                <li>
                  <strong>Con otros usuarios:</strong> Cuando compartes información personal o interactúas en áreas
                  públicas con otros usuarios, dicha información puede ser vista por todos los usuarios.
                </li>
                <li>
                  <strong>Con tu consentimiento:</strong> Podemos divulgar tu información personal para cualquier otro
                  propósito con tu consentimiento.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">5. Seguridad de tus datos personales</h2>
              <p>
                La seguridad de tus datos personales es importante para nosotros, pero recuerda que ningún método de
                transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Si bien nos esforzamos
                por utilizar medios comercialmente aceptables para proteger tus datos personales, no podemos garantizar
                su seguridad absoluta.
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">6. Tus derechos de protección de datos</h2>
              <p>
                Si eres residente del Espacio Económico Europeo (EEE), tienes ciertos derechos de protección de datos.
                EvoTickets tiene como objetivo tomar medidas razonables para permitirte corregir, modificar, eliminar o
                limitar el uso de tus datos personales.
              </p>

              <p>
                Si deseas ser informado sobre qué datos personales tenemos sobre ti y si deseas que sean eliminados de
                nuestros sistemas, por favor contáctanos.
              </p>

              <p>En determinadas circunstancias, tienes los siguientes derechos de protección de datos:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  <strong>El derecho de acceso, actualización o eliminación</strong> de la información que tenemos sobre
                  ti.
                </li>
                <li>
                  <strong>El derecho de rectificación:</strong> Tienes el derecho de rectificar tu información si esa
                  información es inexacta o incompleta.
                </li>
                <li>
                  <strong>El derecho de oposición:</strong> Tienes el derecho de oponerte a que procesemos tus datos
                  personales.
                </li>
                <li>
                  <strong>El derecho de restricción:</strong> Tienes el derecho de solicitar que restrinjamos el
                  procesamiento de tu información personal.
                </li>
                <li>
                  <strong>El derecho a la portabilidad de datos:</strong> Tienes el derecho de recibir una copia de la
                  información que tenemos sobre ti en un formato estructurado, legible por máquina y de uso común.
                </li>
                <li>
                  <strong>El derecho a retirar el consentimiento:</strong> También tienes el derecho de retirar tu
                  consentimiento en cualquier momento cuando EvoTickets se basó en tu consentimiento para procesar tu
                  información personal.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">7. Enlaces a otros sitios web</h2>
              <p>
                Nuestro servicio puede contener enlaces a otros sitios que no son operados por nosotros. Si haces clic
                en un enlace de terceros, serás dirigido al sitio de ese tercero. Te recomendamos encarecidamente que
                revises la Política de Privacidad de cada sitio que visites.
              </p>

              <p>
                No tenemos control ni asumimos responsabilidad alguna por el contenido, las políticas de privacidad o
                las prácticas de sitios o servicios de terceros.
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">
                8. Cambios a esta Política de Privacidad
              </h2>
              <p>
                Podemos actualizar nuestra Política de Privacidad de vez en cuando. Te notificaremos cualquier cambio
                publicando la nueva Política de Privacidad en esta página.
              </p>

              <p>
                Te informaremos por correo electrónico y/o un aviso destacado en nuestro servicio, antes de que el
                cambio entre en vigencia y actualizaremos la fecha de "última actualización" en la parte superior de
                esta Política de Privacidad.
              </p>

              <p>
                Se te aconseja revisar esta Política de Privacidad periódicamente para cualquier cambio. Los cambios a
                esta Política de Privacidad son efectivos cuando se publican en esta página.
              </p>

              <h2 className="text-xl font-semibold text-[#2E1A47] mt-8 mb-4">9. Contáctanos</h2>
              <p>Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Por correo electrónico: privacy@evotickets.com</li>
                <li>Por teléfono: +34 900 123 456</li>
                <li>Por correo postal: Calle Gran Vía, 28, 28013 Madrid, España</li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#A28CD4]/20">
              <Button onClick={() => window.history.back()} className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
