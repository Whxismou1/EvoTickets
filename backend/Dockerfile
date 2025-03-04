FROM maven:3.8.7-openjdk-18-slim AS backend-build

WORKDIR /app

COPY pom.xml /app/pom.xml
COPY src/ /app/src/

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim AS final

WORKDIR /app

COPY --from=backend-build /app/target/backend-0.0.1-SNAPSHOT.jar /app/backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "backend.jar"]
