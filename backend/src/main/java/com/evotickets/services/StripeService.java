package com.evotickets.services;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.evotickets.dtos.TicketRequestDTO;
import com.evotickets.entities.TicketEntity;
import com.evotickets.entities.TicketTypeEntity;
import com.evotickets.entities.UserEntity;
import com.evotickets.exceptions.CustomException;
import com.evotickets.exceptions.StripeSessionCreationException;
import com.evotickets.repositories.TicketRepository;
import com.evotickets.repositories.TicketTypeRepository;
import com.evotickets.repositories.UserRepository;
import com.evotickets.utils.ImageUploader;
import com.evotickets.utils.PDFGenerator;
import com.evotickets.utils.QRGenerator;
import com.stripe.Stripe;
import com.stripe.model.LineItem;
import com.stripe.model.LineItemCollection;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionListLineItemsParams;

@Service
public class StripeService {

    @Value("${stripe.api-key}")
    private String stripeApiKey;

    @Value("${stripe.public-key}")
    private String stripePublicKey;

    @Value("${frontend.base-url}")
    private String frontendBaseUrl;

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TicketTypeRepository ticketTypeRepository;
    private final ImageUploader imageUploader;
    private final PDFStorageService pdfUploader;
    private final EmailService emailService;

    public StripeService(TicketRepository ticketRepository,
            UserRepository userRepository, TicketTypeRepository ticketTypeRepository, ImageUploader imageUploader,
            PDFStorageService pdfUploader, EmailService emailService) {
        this.pdfUploader = pdfUploader;
        this.emailService = emailService;
        this.imageUploader = imageUploader;
        this.ticketRepository = ticketRepository;
        this.ticketTypeRepository = ticketTypeRepository;
        this.userRepository = userRepository;
    }

    public String crearCheckoutSession(List<TicketRequestDTO> tickets) {
        Stripe.apiKey = stripeApiKey;

        try {
            List<SessionCreateParams.LineItem> lineItems = tickets.stream().map(ticket -> {
                TicketTypeEntity tipo = ticketTypeRepository.findById(ticket.getTicketTypeId())
                        .orElseThrow(() -> new CustomException("Ticket no encontrado"));

                long priceInCents = BigDecimal.valueOf(tipo.getPrice()).multiply(BigDecimal.valueOf(100)).longValue();

                return SessionCreateParams.LineItem.builder()
                        .setQuantity((long) ticket.getQuantity())
                        .setPriceData(
                                SessionCreateParams.LineItem.PriceData.builder()
                                        .setCurrency("eur")
                                        .setUnitAmount(priceInCents)
                                        .setProductData(
                                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                        .setName("Entrada - " + tipo.getName())
                                                        .putMetadata("ticketTypeId", String.valueOf(tipo.getId()))
                                                        .build())
                                        .build())
                        .build();
            }).toList();

            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.PAYMENT)
                    .setSuccessUrl(frontendBaseUrl + "/success?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(frontendBaseUrl + "/error")
                    .addAllLineItem(lineItems)
                    .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                    .build();

            Session session = Session.create(params);
            return session.getId();
        } catch (Exception e) {
            throw new StripeSessionCreationException("Error creando sesión de Stripe: " + e.getMessage());
        }
    }

    public Map<String, String> confirmOrder(String sessionId) {
        Stripe.apiKey = stripeApiKey;

        try {
            Session session = Session.retrieve(sessionId);

            if (!"complete".equals(session.getStatus())) {
                throw new CustomException("La sesión aún no está completada");
            }

            String customerEmail = session.getCustomerDetails().getEmail();
            UserEntity user = userRepository.findByEmail(customerEmail)
                    .orElseThrow(() -> new CustomException("Usuario no encontrado con email: " + customerEmail));

            SessionListLineItemsParams params = SessionListLineItemsParams.builder().build();

            LineItemCollection lineItems = session.listLineItems(params);

            for (LineItem item : lineItems.getData()) {
                System.out.println("Procesando item: " + item.getId() + ", cantidad: " + item.getQuantity());

                try {
                    // 1. Obtener el ID del precio desde el LineItem
                    String priceId = item.getPrice().getId();

                    // 2. Recuperar el objeto completo del precio desde Stripe
                    com.stripe.model.Price price = com.stripe.model.Price.retrieve(priceId);

                    // 3. Obtener el ID del producto
                    String productId = price.getProduct();

                    // 4. Recuperar el objeto completo del producto desde Stripe
                    com.stripe.model.Product product = com.stripe.model.Product.retrieve(productId);

                    // 5. Obtener el ticketTypeId desde los metadatos del producto
                    String ticketTypeIdStr = product.getMetadata().get("ticketTypeId");

                    if (ticketTypeIdStr == null) {
                        throw new CustomException(
                                "Metadata 'ticketTypeId' no encontrado en el producto con ID: " + productId);
                    }

                    int ticketTypeId = Integer.parseInt(ticketTypeIdStr);

                    TicketTypeEntity ticketType = ticketTypeRepository.findById(ticketTypeId)
                            .orElseThrow(() -> new CustomException("Tipo de ticket no encontrado"));

                    Long quantity = item.getQuantity();

                    for (int i = 0; i < quantity; i++) {
                        TicketEntity ticket = TicketEntity.builder()
                                .user(user)
                                .ticketType(ticketType)
                                .build();
                        ticketRepository.save(ticket);

                        String ticketNumber = String.valueOf(ticket.getId());
                        String qrPath = "/tmp/qr_" + ticketNumber + ".png";
                        QRGenerator.generateQR("https://evotickets.tech/ticket/" + ticketNumber, qrPath);
                        File qrFile = new File(qrPath);
                        String qrUrl = imageUploader.uploadImage(qrFile);

                        String pdfPath = "/tmp/ticket_" + ticketNumber + ".pdf";
                        String fullName = user.getFirstName() + " " + user.getLastName();
                        PDFGenerator.createTicketPDFWithHtmlTemplate(
                                pdfPath,
                                ticketType.getEvent().getName(),
                                fullName,
                                qrUrl,
                                ticketType.getEvent().getStartDate().toString(),
                                ticketType.getEvent().getStartDate().toLocalDate().toString(),
                                ticketType.getEvent().getLocation().getName(),
                                ticketNumber);

                        File pdfFile = new File(pdfPath);
                        String pdfUrl = pdfUploader.uploadPDF(pdfFile, "tickets/" + ticketNumber + ".pdf");

                        emailService.sendTicketEmail(
                                user.getEmail(),
                                fullName,
                                ticketType.getEvent().getName(),
                                ticketType.getEvent().getStartDate().toString(),
                                pdfUrl,
                                pdfFile,
                                ticketType.getEvent().getLocation().getName(),
                                ticketNumber,
                                qrUrl
                               
                                );
                    }

                } catch (Exception ex) {
                    throw new CustomException("Error al procesar el ticket: " + ex.getMessage());
                }
            }

            return Map.of("message", "Compra registrada correctamente");

        } catch (Exception e) {
            throw new CustomException("Error al confirmar la compra: " + e.getMessage());
        }
    }

    public String getStripePublicKey() {
        return stripePublicKey;
    }
}
