# Eureka Discovery Service

This project is a Spring Boot application that serves as a Eureka Discovery Service. It allows microservices to register themselves and discover other services in a cloud environment.

## Prerequisites

- Java 11 or higher
- Maven 3.6 or higher

## Project Structure

```
eureka-discovery-service
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── eurekaserver
│   │   │               └── EurekaDiscoveryServiceApplication.java
│   │   └── resources
│   │       ├── application.yml
│   │       └── static
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── eurekaserver
│                       └── EurekaDiscoveryServiceApplicationTests.java
├── pom.xml
└── README.md
```

## Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd eureka-discovery-service
   ```

2. Build the project using Maven:
   ```
   mvn clean install
   ```

3. Run the application:
   ```
   mvn spring-boot:run
   ```

## Configuration

The application configuration can be found in `src/main/resources/application.yml`. You can customize the server port and other settings as needed.

## Testing

Unit tests are located in `src/test/java/com/example/eurekaserver/EurekaDiscoveryServiceApplicationTests.java`. You can run the tests using:
```
mvn test
```

## License

This project is licensed under the MIT License. See the LICENSE file for more details.