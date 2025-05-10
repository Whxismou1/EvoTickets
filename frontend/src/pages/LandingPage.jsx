"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import IconMapper from "../components/IconMapper";

import eventsData from "../data/events.json";
import featuresData from "../data/features.json";

export default function Home() {
  const { t } = useTranslation();

  const howSteps = t("how_steps", { returnObjects: true }) || [];
    const organizerSteps = t("organizers_steps", { returnObjects: true });

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "200%"]);

  const normalizeCategoryKey = (rawCategory) =>
    rawCategory
      .normalize("NFD") // elimina acentos
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  return (
    <div className="min-h-screen bg-[#F3F0FA]">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with Parallax */}
      <section
        ref={ref}
        className="relative h-screen flex items-center justify-center overflow-hidden pt-16"
      >
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            y: backgroundY,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2E1A47]/70 to-[#5C3D8D]/70 z-10" />

        <div className="container mx-auto px-4 relative z-20">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ y: textY }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t("hero_title1")}{" "}
              <span className="text-[#D7A6F3]">{t("hero_title2")}</span>
            </h1>
            <p className="text-xl text-[#F3F0FA] mb-8">{t("hero_subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#D7A6F3] hover:bg-[#A28CD4] text-[#2E1A47] text-lg px-8 py-6">
                {t("explore_events")}
              </Button>
              <Button
                variant="outline"
                className="border-[#D7A6F3] text-[#F3F0FA] hover:bg-[#D7A6F3]/20 text-lg px-8 py-6"
              >
                {t("buy_tickets")}
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
        >
          <ArrowRight className="h-10 w-10 text-[#F3F0FA] rotate-90" />
        </motion.div>
      </section>

      {/* Event Showcase with Parallax */}
      <section
        id="events"
        className="py-20 bg-gradient-to-b from-[#F3F0FA] to-[#D7A6F3]/20"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2E1A47] mb-4">
              {t("featured_events")}
            </h2>
            <p className="text-lg text-[#5C3D8D] max-w-2xl mx-auto">
              {t("featured_events_subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventsData.map((event, index) => (
              <motion.div
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#A28CD4]/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px rgba(162, 140, 212, 0.2)",
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2E1A47]/70 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#D7A6F3] text-[#2E1A47] px-3 py-1 rounded-full text-xs font-medium">
                      {t(`category.${normalizeCategoryKey(event.category)}`, { defaultValue: event.category })}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-[#F3F0FA] text-sm font-medium">
                      {event.date}
                    </div>
                    <div className="text-[#F3F0FA] text-sm">
                      {event.location}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#2E1A47] mb-2">
                    {event.title}
                  </h3>
                  <p className="text-[#5C3D8D] font-medium mb-4">
                    {t("event.from_price")} {event.price.replace(/^Desde\s*/i, "")}
                  </p>
                  <Button className="w-full bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                    {t("buy_tickets")}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              className="border-[#5C3D8D] text-[#5C3D8D] hover:bg-[#5C3D8D]/10"
            >
              {t("see_all_events")}
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F3F0FA]">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2E1A47] mb-4">
              {t("features_title")}
            </h2>
            <p className="text-lg text-[#5C3D8D] max-w-2xl mx-auto">
              {t("features_subtitle")}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <motion.div
                key={feature.id}
                className="bg-white rounded-xl p-6 shadow-lg border border-[#A28CD4]/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 30px rgba(162, 140, 212, 0.2)",
                }}
              >
                <div className="bg-gradient-to-br from-[#5C3D8D] to-[#A28CD4] text-white p-3 rounded-lg inline-block mb-4">
                  <IconMapper name={feature.icon} />
                </div>
                <h3 className="text-xl font-bold text-[#2E1A47] mb-2">
                  {t(`features.${feature.key}.title`)}
                </h3>
                <p className="text-[#5C3D8D]">{t(`features.${feature.key}.description`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 bg-[#F3F0FA]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#D7A6F3]/20 p-2 rounded-lg inline-block mb-4">
                <span className="text-[#5C3D8D] font-medium">
                  {t("how_it_works")}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2E1A47] mb-6">
                {t("how_title")}
              </h2>
              <p className="text-lg text-[#5C3D8D] mb-6">
                {t("how_description")}
              </p>

              <ul className="space-y-4 mb-8">
                {howSteps.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="bg-[#A28CD4] rounded-full p-1 mt-1">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-[#2E1A47]">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                {t("explore_events")}
              </Button>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="EvoTickets App"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-2/3 h-2/3 bg-[#A28CD4]/20 rounded-xl -z-10" />
              <div className="absolute -top-6 -left-6 w-1/2 h-1/2 bg-[#D7A6F3]/30 rounded-xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Organizers Section */}
      <section id="organizers" className="py-20 bg-[#F3F0FA]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border-8 border-white">
                <img
                  src="/placeholder.svg?height=600&width=800"
                  alt="EvoTickets para Organizadores"
                  className="w-full"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-2/3 h-2/3 bg-[#A28CD4]/20 rounded-xl -z-10" />
              <div className="absolute -top-6 -right-6 w-1/2 h-1/2 bg-[#D7A6F3]/30 rounded-xl -z-10" />
            </motion.div>

            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-[#D7A6F3]/20 p-2 rounded-lg inline-block mb-4">
                <span className="text-[#5C3D8D] font-medium">
                  {t("for_organizers")}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2E1A47] mb-6">
                {t("organizers_title")}
              </h2>
              <p className="text-lg text-[#5C3D8D] mb-6">
                {t("organizers_description")}
              </p>

              <ul className="space-y-4 mb-8">
                {organizerSteps.map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="bg-[#A28CD4] rounded-full p-1 mt-1">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-[#2E1A47]">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-[#5C3D8D] hover:bg-[#2E1A47] text-white">
                  {t("contact_support")}
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-r from-[#5C3D8D] to-[#2E1A47]"
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              {t("cta_title")}
            </h2>
            <p className="text-xl text-[#D7A6F3] mb-8">{t("cta_subtitle")}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#D7A6F3] hover:bg-[#A28CD4] text-[#2E1A47] text-lg px-8 py-6">
                {t("explore_events")}
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
