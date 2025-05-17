# Notification Service

This project is a **notification service** backend built with **Node.js**, **Express**, **MongoDB**, and **RabbitMQ**. It supports sending **email**, **SMS**, and **in-app** notifications with reliable queue-based processing and retry handling.

---

## Features

- Create and queue notifications via REST API
- Supports multiple notification types: email, SMS, in-app
- Asynchronous processing with RabbitMQ queue consumer
- Automatic retry for failed notifications with exponential backoff
- Status tracking: pending, sent, failed
- Retrieve user notifications via API

---

## Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)
- RabbitMQ server running locally or accessible remotely

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/yashsoni978/Pepsales-test.git
cd Pepsales-test
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables
  Create a .env file in the project root:
```env
PORT=3000
MONGO_URI=
RABBITMQ_URL=
```

### 4. Start MongoDB and RabbitMQ
Make sure MongoDB and RabbitMQ servers are running and accessible based on your .env config.

### 5. Run the server and worker
Start the Express server:
```bash
node server.js
```
In a separate terminal, start the RabbitMQ consumer worker:
```bash
node worker.js
```
### 6. Test the API
Send notification:
POST to http://localhost:3000/api/notifications with JSON body like:
```json
{
  "userId": "user123",
  "type": "email",
  "message": {
    "to": "user@example.com",
    "subject": "Welcome!",
    "body": "This is a test email notification."
  }
}
```
Get user notifications:
GET http://localhost:3000/api/users/{UserId}/notifications

## Assumptions
- RabbitMQ and MongoDB are available and properly configured.
- The notification message schema is flexible and may contain nested objects.
- Email and SMS sending handlers currently simulate sending with console logs; real integrations can be added later.
- Retry logic is implemented for transient failures with exponential backoff.
- The in-app notification handler is designed for backend processing; front-end consumption is outside this scope.

