FROM maven:3.8.6-openjdk-17-slim AS backend-build

WORKDIR /app/backend

COPY backend/pom.xml backend/pom.xml
COPY backend/src/ backend/src/

RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim AS final

WORKDIR /app

COPY --from=backend-build /app/backend/target/backend-0.0.1-SNAPSHOT.jar /app/backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "backend.jar"]
