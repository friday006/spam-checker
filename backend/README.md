# Spam Checker API

The Spam Checker API is a serverless application designed for identifying spam phone numbers, managing user contacts, and providing search functionality. It leverages the Hono framework, Prisma ORM, and Cloudflare Workers to deliver fast and efficient performance.

## Features

### Authentication
- **User Signup**: Register a new user with a name, phone number, password, and optional email.
- **User Signin**: Authenticate an existing user using their phone number and password.
- **JWT Authentication**: Protect endpoints and provide secure access to resources.

### Contact Management
- **Add Contact**: Save contacts for logged-in users while ensuring no duplicates.
- **Mark Spam**: Allow users to report phone numbers as spam.

### Search Functionality
- **Search by Name**: Find users whose names match or contain a specific query.
- **Search by Phone**: Retrieve user details based on their phone number, including spam reports.
- **Search Profile Details**: View detailed user profiles with privacy checks to show sensitive information only to authorized users.

## Technologies Used
- **Framework**: [Hono](https://hono.dev) for building lightweight APIs.
- **Database ORM**: [Prisma](https://www.prisma.io) with PostgreSQL for data persistence.
  - **Prisma Accelerate Extension**: Optimized queries for improved performance.
- **Validation**: [Zod](https://zod.dev) for schema validation and custom input validation via a monorepo.
- **Authentication**: JSON Web Tokens (JWT) for secure authentication and authorization.
- **Deployment**: Hosted on [Cloudflare Workers](https://workers.cloudflare.com) for serverless scalability.

## API Endpoints

### Authentication Endpoints
- **POST `/signup`**
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "phone": "1234567890",
      "password": "password123",
      "email": "john.doe@example.com"
    }
    ```
  - Response:
    ```json
    {
      "token": "<JWT_TOKEN>"
    }
    ```

- **POST `/signin`**
  - Request Body:
    ```json
    {
      "phone": "1234567890",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "token": "<JWT_TOKEN>"
    }
    ```

### Contact Management Endpoints
- **POST `/add`** (Requires JWT)
  - Request Body:
    ```json
    {
      "name": "Alice",
      "phone": "9876543210"
    }
    ```
  - Response:
    ```json
    {
      "message": "Contact added successfully!",
      "contact": {
        "id": "<CONTACT_ID>",
        "name": "Alice",
        "phone": "9876543210"
      }
    }
    ```

- **POST `/spam`** (Requires JWT)
  - Request Body:
    ```json
    {
      "phone": "9876543210"
    }
    ```
  - Response:
    ```json
    {
      "message": "The number has been marked as spam successfully."
    }
    ```

### Search Endpoints
- **GET `/search/name?query=<NAME>`**
  - Response:
    ```json
    {
      "message": "Search results by name",
      "results": [
        {
          "id": "<USER_ID>",
          "name": "Alice",
          "phone": "9876543210",
          "spams": [
            {
              "id": "<SPAM_ID>",
              "phone": "9876543210"
            }
          ]
        }
      ]
    }
    ```

- **GET `/search/phone?query=<PHONE>`**
  - Response:
    ```json
    {
      "message": "Registered user found by phone number:",
      "user": {
        "id": "<USER_ID>",
        "name": "Alice",
        "phone": "9876543210",
        "email": "alice@example.com",
        "spams": []
      }
    }
    ```

- **GET `/search/profile?userId=<USER_ID>`** (Requires JWT)
  - Response:
    ```json
    {
      "message": "Profile found successfully:",
      "profile": {
        "id": "<USER_ID>",
        "name": "Alice",
        "phone": "9876543210",
        "email": "null",
        "spams": []
      }
    }
    ```

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org) (v16 or higher)
- [Cloudflare CLI](https://developers.cloudflare.com/workers/wrangler/)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/friday006/spam-checker.git
   cd spam-checker
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Setup Environment Variables**:
   Create a `.env` file and provide the following:
   ```env
   DATABASE_URL=<YOUR_DATABASE_URL>
   JWT_SECRET=<YOUR_SECRET>
   ```

4. **Deploy to Cloudflare Workers**:
   ```bash
   npm run deploy
   ```

5. **Access the API**:
   The API will be available at your configured Cloudflare Worker domain, e.g., `https://backend.priyankarnigam786.workers.dev/`.

## Contributing
Feel free to fork this repository and make changes. Contributions are welcome!

## License
This project is licensed under the MIT License.

