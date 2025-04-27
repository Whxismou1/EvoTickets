package com.evotickets.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;


@Configuration
public class RabbitMQConfig {
    public static final String NOTIFICATION_QUEUE = "notification-queue";
    public static final String NOTIFICATION_EXCHANGE = "notification-exchange";
    public static final String NOTIFICATION_ROUTING_KEY = "notification.key";

    @Bean
    public Queue queue() {
        return new Queue(NOTIFICATION_QUEUE);
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange(NOTIFICATION_EXCHANGE);
    }

    @Bean
    public Binding binding(Queue queue, DirectExchange exchange) {
        return BindingBuilder.bind(queue).to(exchange).with(NOTIFICATION_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
            Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        return template;
    }

}
