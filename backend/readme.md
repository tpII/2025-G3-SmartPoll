# Smart Poll - Backend

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/tpII/2025-G3-SmartPoll.git
    cd 2025-G3-SmartPoll
    ```

2.  **Build the project:** This will download dependencies and compile the source code.
    ```bash
    docker-compose up db backend --build
    ```

The application will start on `http://localhost:8080`.


## API Documentation (Swagger)

The API is documented using OpenAPI 3. Once the application is running, you can access the Swagger UI to explore and test the endpoints at the following URL:

[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Postman

[Probar Endpoint en Postman](https://gonzaloblasco.postman.co/workspace/Gonzalo-Blasco's-Workspace~75061af9-c165-4db6-87b2-0c63b99b3517/collection/45810738-88f622fb-0f8f-4832-aea9-e48568f01aa9?action=share&creator=45810738)


## Project Structure

The project follows a layered architecture, separating responsibilities into different packages:

-   `config`: Contains Spring configuration classes.
-   `controller`: Handles incoming HTTP requests. Defines the REST API endpoints for each resource.
-   `dto`: Contains Data Transfer Objects (DTOs). Used to model the API request and response bodies, decoupling the API layer from the database entities.
-   `entity`: Contains the JPA entities that are mapped to database tables.
-   `exceptions`: Defines custom exception classes for handling application-specific errors.
-   `mapper`: MapStruct interfaces for converting DTOs to Entities and vice-versa, reducing boilerplate code.
-   `repository`: Spring Data JPA interfaces for data access operations.
-   `service`: Contains the core business logic of the application.
