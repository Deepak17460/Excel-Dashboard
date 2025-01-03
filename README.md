# Project Setup and Testing

This project includes a MySQL database, a Node.js server, and a React.js frontend. Below are the steps to set up the environment and test the application.

## Prerequisites
- Docker and Docker Compose installed on your system.

## Steps to Set Up the Environment

1. **Create a `.env` File**  
   Create a `.env` file in the root directory of the project. Add the following environment variables:

   ```dotenv
   # MySQL Configuration
   DATABASE_HOST=mysql
   DATABASE_USER=root
   DATABASE_PASSWORD=your_database_password
   DATABASE_NAME=your_database_name

   # Node.js Server Configuration
   SERVER_PORT=5000
   JWT_SECRET_KEY=your_jwt_secret_key

   # React App Configuration
   REACT_APP_SERVER_URL=http://localhost:5000

   # Miscellaneous
   PORT=5000
   TIMESTAMP=$(date +%s)
   ```

   Replace the placeholder values (e.g., `your_database_password`, `your_database_name`, and `your_jwt_secret_key`) with your own values.

2. **Build and Run the Application**  
   Use the following command to build and run the application:

   ```bash
   docker-compose up --build
   ```

3. **Access the Application**  
   - **React Frontend**: Open your browser and go to `http://localhost:8000`.
   - **Node.js Server**: The backend API will be available at `http://localhost:5000`.
   - **MySQL Database**: Accessible at `localhost:3307` with the credentials set in the `.env` file.

## Notes
- Ensure the `.env` file is in the same directory as the `docker-compose.yml` file.
- You can stop the services by running:

  ```bash
  docker-compose down
  ```

- To clean up volumes, add the `-v` flag:

  ```bash
  docker-compose down -v
  ```

## Troubleshooting
- Verify that the `.env` file contains the correct values.
- Ensure no other services are running on the ports used by the application (`8000`, `5000`, `3307`).

Enjoy testing your application! 🚀