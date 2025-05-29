package com.evotickets.utils;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;

public class PDFGenerator {

    public static void createTicketPDFWithHtmlTemplate(String outputPath, String eventName, String userInfo,
            String qrUrl, String eventDate,
            String eventDateShort,
            String eventLocation,
            String ticketNumber) throws Exception {
        String htmlTemplate = loadTemplateFromResources("templates/ticket.html");

        String filledHtml = htmlTemplate
                .replace("[[EVENT_NAME]]", eventName)
                .replace("[[USER_INFO]]", userInfo)
                .replace("[[QR_IMAGE_URL]]", qrUrl)
                .replace("[[EVENT_DATE]]", eventDate)
                .replace("[[EVENT_DATE_SHORT]]", eventDateShort)
                .replace("[[EVENT_LOCATION]]", eventLocation)
                .replace("[[TICKET_NUMBER]]", ticketNumber);

        // Convertir HTML a PDF usando iText 7
        try (PdfWriter writer = new PdfWriter(new FileOutputStream(outputPath));
                PdfDocument pdf = new PdfDocument(writer)) {

            ConverterProperties properties = new ConverterProperties();
            // Configurar propiedades adicionales si es necesario
            properties.setBaseUri(""); // Para recursos locales

            // Convertir HTML a PDF
            HtmlConverter.convertToPdf(filledHtml, pdf, properties);
        }
    }

    private static String loadTemplateFromResources(String path) throws IOException {
        InputStream inputStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(path);
        if (inputStream == null) {
            throw new IOException("No se encontró la plantilla: " + path);
        }
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }
}
