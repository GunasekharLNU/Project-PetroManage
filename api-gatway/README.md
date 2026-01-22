# User Microservice

This project is a Spring Boot application that implements a user microservice. It provides a RESTful API for performing CRUD operations on user entities.

## Project Structure

```
user-microservice
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com
│   │   │       └── example
│   │   │           └── usermicroservice
│   │   │               ├── UserMicroserviceApplication.java
│   │   │               ├── controller
│   │   │               │   └── UserController.java
│   │   │               ├── model
│   │   │               │   └── User.java
│   │   │               ├── repository
│   │   │               │   └── UserRepository.java
│   │   │               └── service
│   │   │                   └── UserService.java
│   │   └── resources
│   │       ├── application.properties
│   │       └── data.sql
│   └── test
│       └── java
│           └── com
│               └── example
│                   └── usermicroservice
│                       └── UserMicroserviceApplicationTests.java
├── pom.xml
└── README.md
```

## Technologies Used

- Java 17
- Spring Boot
- Spring Data JPA
- H2 Database (for in-memory database)
- Maven

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd user-microservice
   ```

2. **Build the project:**
   ```
   mvn clean install
   ```

3. **Run the application:**
   ```
   mvn spring-boot:run
   ```

4. **Access the API:**
   The application will be running on `http://localhost:8080`. You can use tools like Postman or curl to interact with the API.

## API Endpoints

- `POST /users` - Create a new user
- `GET /users` - Retrieve all users
- `GET /users/{id}` - Retrieve a user by ID
- `PUT /users/{id}` - Update a user by ID
- `DELETE /users/{id}` - Delete a user by ID

## Database Initialization

The `data.sql` file is used to initialize the database with sample data when the application starts.

## Testing

Unit tests are provided in the `UserMicroserviceApplicationTests.java` file to verify the functionality of the application. You can run the tests using:

```
mvn test
```

## License

This project is licensed under the MIT License.