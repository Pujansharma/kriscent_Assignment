# Book Management API

This project provides a RESTful API for managing books and users, featuring user authentication, role-based access control, and CRUD operations for books. The backend is built with Node.js, Express, and MongoDB.

## Table of Contents

- [Setup](#setup)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Starting the Server](#starting-the-server)
- [API Endpoints](#api-endpoints)
  - [User Management](#user-management)
    - [Register a New User](#register-a-new-user)
    - [Log in a User](#log-in-a-user)
    - [Get All Users (Admin Only)](#get-all-users-admin-only)
    - [Update a User (Admin Only)](#update-a-user-admin-only)
    - [Delete a User (Admin Only)](#delete-a-user-admin-only)
  - [Book Management](#book-management)
    - [Add a New Book (Admin/Author Only)](#add-a-new-book-adminauthor-only)
    - [Update a Book (Admin/Author Only)](#update-a-book-adminauthor-only)
    - [Get All Books](#get-all-books)
    - [Get a Book by ID](#get-a-book-by-id)
    - [Search Books by Title](#search-books-by-title)
    - [Delete a Book by ID (Admin Only)](#delete-a-book-by-id-admin-only)
- [Models](#models)
  - [User Model](#user-model)
  - [Book Model](#book-model)
- [Middleware](#middleware)
  - [Authentication Middleware](#authentication-middleware)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Setup

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/book-management-api.git
    cd book-management-api
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

### Configuration

Create a `.env` file in the root directory and populate it with the following variables:

MONGO_URI=mongodb://localhost:27017/book-management
JWT_SECRET=your_jwt_secret

### Starting the Server

To start the application, run:

```bash
npm start
The server will listen on http://localhost:3000.
```
API Endpoints
User Management
Register a New User
Endpoint: POST /api/users/register

Request Body:
```
{
  "name": "sharma pujan",
  "email": "pujan.doe@example.com",
  "password": "password123"
}
```
Note: The role will default to 'Reader'.

Response:
```
{
  "_id": "60d9c42ab5d2c10017a0c123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Reader",
  "token": "jwt_token_here"
}
```
The token will be stored in Redis. If not found in the header, it will be searched for in Redis.

Log in a User
Endpoint: POST /api/users/login

Request Body:
```
{
  "email": "john.doe@example.com",
  "password": "password123"
}

{
  "_id": "60d9c42ab5d2c10017a0c123",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "Reader",
  "token": "jwt_token_here"
}
```
Get All Users (Admin Only)
Endpoint: GET /api/users/

Unauthorized Response:
```
{
  "message": "Access denied"
}
```
Authorized Response:
```
{
  "users": [
    {
      "_id": "60d9c42ab5d2c10017a0c123",
      "name": "Admin User",
      "email": "admin@example.com",
      "password": "hashed_password",
      "role": "Admin",
      "__v": 0
    },
    {
      "_id": "60d9c42ab5d2c10017a0c124",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "hashed_password",
      "role": "Reader",
      "__v": 0
    }
  ]
}
```
Update a User (Admin Only)
Endpoint: PUT /api/users/:id

Request Body:

```

{
  "name": "Updated Name"
}
```
Unauthorized Response:

```

{
  "message": "Access denied"
}
```
Authorized Response:


```
{
  "message": "User updated successfully"
}
```
Delete a User (Admin Only)
Endpoint: DELETE /api/users/:id

Unauthorized Response:


```
{
  "message": "Access denied"
}
```
Authorized Response:


```
{
  "message": "User deleted successfully"
}
```
Book Management
Add a New Book (Admin/Author Only)
Endpoint: POST /api/books

Request Body:

```

{
  "title": "New Book Title",
  "author": "Author Name",
  "year": 2021,
  "coverPage": "URL to cover image"
}
```
Response:


```
{
  "message": "Book added successfully",
  "book": {
    "_id": "60d9c42ab5d2c10017a0c125",
    "title": "New Book Title",
    "author": "Author Name",
    "year": 2021,
    "coverPage": "URL to cover image"
  }
}
```
Update a Book (Admin/Author Only)
Endpoint: PUT /api/books/:id

Request Body:

```

{
  "author": "Updated Author"
}
```
Response:


```
{
  "message": "Book updated successfully"
}
```
Get All Books
Endpoint: GET /api/books

Response:

```

[
  {
    "_id": "60d9c42ab5d2c10017a0c126",
    "title": "Book One",
    "author": "Author One",
    "year": 2020,
    "coverPage": "URL to cover image"
  },
  {
    "_id": "60d9c42ab5d2c10017a0c127",
    "title": "Book Two",
    "author": "Author Two",
    "year": 2019,
    "coverPage": "URL to cover image"
  }
]
```
Get a Book by ID
Endpoint: GET /api/books/:id

Response:

```

{
  "book": {
    "_id": "60d9c42ab5d2c10017a0c126",
    "title": "Book One",
    "author": "Author One",
    "year": 2020,
    "coverPage": "URL to cover image"
  }
}
```
Search Books by Title
Endpoint: GET /api/books/search?title=search_query

Response:

```

[
  {
    "_id": "60d9c42ab5d2c10017a0c128",
    "title": "Searched Book",
    "author": "Searched Author",
    "year": 2018,
    "coverPage": "URL to cover image"
  }
]
```
Delete a Book by ID (Admin Only)
Endpoint: DELETE /api/books/:id

Response:


```
{
  "message": "Book deleted successfully"
}
```
Models
User Model
javascript

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Author', 'Reader'], default: 'Reader' }
});

module.exports = mongoose.model('User', userSchema);
Book Model
javascript

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  coverPage: { type: String }
});

module.exports = mongoose.model('Book', bookSchema);
