# Assessment ITS API

This is a NestJS application that provides APIs for managing users and logs. It uses PostgreSQL as the database and includes endpoints for user management and log retrieval, with options for soft and hard deletes and flexible search functionality.

## API Documentation

The API documentation is available at: [http://localhost:3000/api](http://localhost:3000/api)

## Endpoints

### Users

#### Create a User

- **URL**: `/users`
- **Method**: `POST`
- **Description**: Creates a new user and its log in log table.
- **Request Body**:
  ```json
  {
    "fullName": "Ghulam Ghaus",
    "email": "ghulam.ghaus@example.com",
    "password": "securepassword"
  }
  ```

Update a User
URL: /users/{id}
Method: PATCH
Description: Updates the details of an existing user by ID and user log in log table.

```json
{
  "fullName": "Ghulam Ghaus2",
  "email": "ghulam.ghaus2@example.com"
}
```

Delete a User
URL: /users/{id}
Method: DELETE
Description: Deletes a user by ID. Can perform a soft delete or hard delete.
Query Parameters:
hardDelete (boolean, optional): If true, performs a hard delete; otherwise, performs a soft delete.

http://localhost:3000/user?hardDelete=true

Find All Users
URL: /users
Method: GET
Description: Retrieves a list of users. Supports optional query parameters for filtering and searching.
Query Parameters:
fullName (string): Filter users by full name.
email (string): Filter users by email.
creationTimestamp (string, ISO date): Filter users by creation date.
lastUpdateTimestamp (string, ISO date): Filter users by last update date.
isDeleted (boolean): Include or exclude soft-deleted users.

http://localhost:3000/user?includeDeleted=true&fullName=Ghulam Ghaus&email=ghulam.ghaus

Logs
Find All Logs
URL: /logs
Method: GET
Description: Retrieves a list of logs. Supports optional query parameter for filtering by userId.
Query Parameters:
userId (number): Filter logs by user ID.

http://localhost:3000/logs?userId=1

### Summary

- **Introduction**: Brief overview of the API and its purpose.
- **Endpoints**: Detailed descriptions for `Create`, `Update`, `Delete`, `Find All` users, and `Find All` logs, including request/response examples and query parameters.
- **Running the Application**: Instructions for starting the application.
- **License**: Information about the project's license.

Feel free to adjust any details as needed for your project.
