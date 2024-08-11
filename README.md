# LRU Cache Implementation in Golang

## Overview

Least Recently Used cache alogirthm in Go lang. Contains APIS to get and set the keys within the cache. Supported by a react front end. Mutex to handle concurrency in go routines. 

## Project Structure

- `controllers/`: Contains the controller level logic.
- `models/`: Contains data model and the LRU cache model
- `routes/`: Contains route definitions and configuration. I've Used GIN for router configurations
- `lrucaching-frontend`: Contains the react frontend, I've used a simple css, the Cacheform.js file contains all the JSX and states for the frontend 
- `main.go`: Entry point for the application, sets up Gin routes and starts the server.

## API Endpoints


### Set Key-Value Pair

- **Endpoint:** `POST /girishLru/setKey`
- **Description:** Sets a key-value pair in the cache with a timeout that the user speicifies.
- **Request Body:**
  ```json
  {
    "key": "string",
    "value": "string",
    "timeout": "integer"
  }
  ```
- **Response:**
  - **Success:** `200 OK`
  - **Error:** `500 Internal Server Error` (Server issue)

### Get Key-Value Pair

- **Endpoint:** `GET /girishLru/get/:key`
- **Description:** Retrieves a value from the cache based on the key. Throws an error if the key doesn't exist or has expired.
- **Response:**
  - **Success:** `200 OK` with the value in JSON format:
  - **Error:** `404 Not Found` (Key not found or expired), `500 Internal Server Error` (Server issue)

## Frontend

The frontend is a React application that interacts with the cache API.

- **Directory:** `lrucaching-frontend/`
- **Features:**
  - Allows users to set and get cache values.
- **File:** `cacheForm.js` - Contains all the JSX and states for the frontend.
- **CSS:** I've used simple CSS for styling.

### Frontend Code Comments

In `CacheForm.js`:
- **State Management:** Handles state for operations (`set` or `get`), key, value, and timeout.
- **Form Submission:** Performs an API request based on the selected operation (`set` or `get`) and updates the result or error state.
- **UI Updates:** Displays results or errors based on API responses, and resets the result container on each key retrieval.

## Setup and Installation

### Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/rayanscrib/LRU-Caching.git
   ```

2. **Backend Setup:**

   - Navigate to the backend project directory:
     ```bash
     cd LRUCaching
     ```

   - Install Go dependencies:
     ```bash
     go mod tidy
     ```

   - Build and run the server:
     ```bash
     go run main.go
     ```

   - The server will be running at `http://localhost:8080`.

3. **Frontend Setup:**

   - Navigate to the `lrucaching-frontend` directory:
     ```bash
     cd lrucaching-frontend
     ```

   - Install dependencies:
     ```bash
     npm install
     ```

   - Start the React application:
     ```bash
     npm start
     ```

   - The frontend will be accessible at `http://localhost:3000`.

## Contact

For any questions or issues, please contact girikohli2001@gmail.com
