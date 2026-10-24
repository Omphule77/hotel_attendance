# ===================================================================
# 1. Build Stage: Compile and Package Spring Boot Application
# ===================================================================
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production jar without running tests
RUN mvn clean package -DskipTests

# ===================================================================
# 2. Runtime Stage: Lightweight JRE Container
# ===================================================================
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create non-root application user for improved security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy built JAR artifact from builder stage
COPY --from=builder /app/target/hotel-attendance-1.0.0.jar app.jar

# Set file permissions for the app user
RUN chown appuser:appgroup app.jar

USER appuser

# Expose Spring Boot default port
EXPOSE 8080

# Recommended JVM memory settings for micro/small EC2 instances (t2.micro / t3.small)
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseG1GC"

# Launch Spring Boot
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
