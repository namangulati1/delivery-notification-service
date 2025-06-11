# delivery-notification-service

This service is responsible for managing and sending delivery notifications.

## Setup Instructions

### Prerequisites

- Node.js (version X.X.X or higher)
- npm (version X.X.X or higher)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/delivery-notification-service.git
    cd delivery-notification-service
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file by copying the example file:

    ```bash
    cp .env.example .env
    ```

    Open `.env` and fill in the required values for your environment (e.g., database credentials, API keys).

### Running the Application

-   **Development Mode:**

    This command will start the application with hot-reloading enabled.

    ```bash
    npm run dev
    ```

-   **Build for Production:**

    This command will build the application for production use.

    ```bash
    npm run build
    ```

-   **Production Mode:**

    This command will start the application in production mode. Ensure you have built the application first.

    ```bash
    npm start
    ```

## API Documentation

The following are the available API endpoints:

-   ### `GET /health`

    **Description:** Health check endpoint to verify the service is running.

    **Response:**
    -   `200 OK` - If the service is healthy.
    -   `503 Service Unavailable` - If the service is not healthy.

-   ### `POST /api/notifications`

    **Description:** Creates a new notification.

    **Request Body:**

    ```json
    {
      "userId": "string",
      "message": "string",
      "type": "string" // e.g., 'order_shipped', 'delivery_update'
    }
    ```

    **Response:**
    -   `201 Created` - Notification created successfully.
    -   `400 Bad Request` - Invalid request body.

-   ### `GET /api/notifications/:userId`

    **Description:** Retrieves all notifications for a specific user.

    **Parameters:**
    -   `userId` (string): The ID of the user.

    **Response:**
    -   `200 OK` - Returns an array of notification objects.
    -   `404 Not Found` - If the user has no notifications or the user does not exist.

-   ### `PUT /api/notifications/:notificationId/read`

    **Description:** Marks a specific notification as read.

    **Parameters:**
    -   `notificationId` (string): The ID of the notification.

    **Response:**
    -   `200 OK` - Notification marked as read successfully.
    -   `404 Not Found` - If the notification does not exist.

## Contribution Guidelines

We welcome contributions to enhance this service! Please follow these steps:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
    or
    ```bash
    git checkout -b bugfix/issue-number
    ```
3.  **Make your changes** and commit them with clear and concise messages.
4.  **Ensure tests pass:**
    Run the test suite to make sure your changes haven't introduced any regressions.
    ```bash
    npm test
    ```
5.  **Lint your code:**
    Ensure your code adheres to the project's linting standards.
    ```bash
    npm run lint
    ```
6.  **Submit a pull request** to the `main` branch of the original repository. Provide a detailed description of your changes in the pull request.

Thank you for contributing!
