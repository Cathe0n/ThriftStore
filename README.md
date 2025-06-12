# VERO Thrift Store - E-commerce Platform

[![Swiss German University](https://img.shields.io/badge/Swiss%20German%20University-Final%20Project-blue)](https://sgu.ac.id/)
[![Language-JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Language-Go](https://img.shields.io/badge/Language-Go-blue)](https://golang.org/)
[![Framework-ExpressJS](https://img.shields.io/badge/Framework-Express.js-lightgrey)](https://expressjs.com/)
[![Language-React](https://img.shields.io/badge/Language-React-blue)](https://reactjs.org/)
[![Framework-Django](https://img.shields.io/badge/Framework-Django-darkgreen)](https://www.djangoproject.com/)
[![GraphQL](https://img.shields.io/badge/API-GraphQL-e10098)](https://graphql.org/)
[![Database-MongoDB](https://img.shields.io/badge/Database-MongoDB-4EA94B)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue)](https://www.docker.com/)

VERO Thrift Store is an e-commerce website specifically designed for buying and selling used clothing. This platform promotes sustainability and affordability in fashion by offering users a streamlined and intuitive experience.

**Swiss German University - Final Project**
*   Bryant Gabriel Effendi
*   Justin Sye
*   Kayden Ciazaria
*   Troy Devdan
*   Zhilan Fadhlurrahman Firdaus

---

## Table of Contents

1.  [Introduction](#introduction)
    *   [Project Overview](#project-overview)
    *   [Problem Statement](#problem-statement)
2.  [Key Features](#key-features)
    *   [User Features](#user-features)
    *   [Admin Features](#admin-features)
3.  [Tech Stack & Architecture](#tech-stack--architecture)
    *   [System Architecture Overview](#system-architecture-overview)
    *   [Frontend](#frontend)
    *   [Middleware](#middleware)
    *   [Backend](#backend)
    *   [Database](#database)
    *   [Containerization](#containerization)
4.  [System Diagrams (Conceptual)](#system-diagrams-conceptual)
5.  [Getting Started](#getting-started)
    *   [Prerequisites](#prerequisites)
    *   [Installation & Running](#installation--running)
6.  [Application Showcase (Highlights)](#application-showcase-highlights)
7.  [Future Recommendations](#future-recommendations)
8.  [License](#license)

---

## 1. Introduction

### 1.1 Project Overview
VERO Thrift Store is an e-commerce platform dedicated to the buying and selling of second-hand apparel. Our goal is to provide a seamless and intuitive user experience, fostering sustainability and affordability within the fashion industry. The development process integrates traditional and modern web technologies, with a strong emphasis on performance, scalability, and maintainability.

### 1.2 Problem Statement
The fashion industry contributes significantly to global pollution, with 92 million tons of clothing discarded annually, including luxury items. As consumer consciousness shifts towards environmental responsibility, there's a prime opportunity for thrift stores to flourish. VERO Thrift Store aims to address this by providing a user-friendly website for both customers and sellers, bringing the thrift shopping experience into the modern digital landscape.

---

## 2. Key Features

### User Features:
*   **Account Management:** Sign up, login, and logout functionalities within a non-disruptive pop-up window.
*   **Tag-Based Search:** Search for items using specific tags (brand, type, style) for precise results.
*   **Shopping Cart:** Add multiple products to a cart, remove items, and proceed to a streamlined checkout.
*   **Product Information:** View product images and detailed descriptions.
*   **Size Selection:** See real-time availability for different sizes and choose accordingly.
*   **AI Chatbot Support:** Get automated assistance for FAQs, shopping guidance, product recommendations, and navigation, with contextual understanding of previous conversations.
*   **Wishlist:** Add products to a wishlist for future purchase.
*   **Purchase History:** Access a complete history of past orders.

### Admin Features:
*   **Tags Management:** Create, assign, and manage tags for products to enhance categorization and search.
*   **Product Management (CRUD):** Upload product images, write/edit descriptions, manage multiple size options, and assign specific inventory quantities for each size.
*   **Order Tracking & Management:** Track orders placed by users and view user addresses to streamline the delivery process.

---

## 3. Tech Stack & Architecture

### 3.1 System Architecture Overview
The platform is designed with a modern microservices-oriented approach, consisting of a distinct Frontend, Middleware, and Backend, all containerized using Docker for consistency and scalability.

*   **Frontend:** Client-side application providing the user interface. (Specific framework like React, Vue, or Angular - assumed from `Dockerfile(Frontend)`)
*   **Middleware:** Acts as a proxy and intermediary layer, handling request logging, query sanitization, rate-limiting, and enhancing security.
*   **Backend:** Server-side application managing business logic, data processing, and API provision via GraphQL. The project explored implementations using:
    *   **Express.js (Node.js):** Utilizing Mongoose for MongoDB object modeling, with `typeDefs` for GraphQL schema definitions and `resolvers` for implementing query/mutation logic, all integrated into an Apollo Server.
    *   **Django (Python):** Employing Django's ORM for database models, with `schema.py` defining the GraphQL schema and resolver methods connecting GraphQL operations to backend logic.
    *(Note: The primary containerized backend in the `docker-compose.yml` should be specified here if one was chosen over the other for final deployment.)*
*   **Database:** MongoDB (implied by Mongoose usage in the Express.js backend description).
*   **Containerization:** Docker and Docker Compose for creating consistent development/production environments and simplifying deployment.

### 3.2 Frontend
*   Responsible for rendering the user interface and handling user interactions.
*   Communicates with the Middleware/Backend via API calls.
*   `Dockerfile(Frontend)` details its build process.

### 3.3 Middleware
*   Acts as a reverse proxy, typically listening on `localhost:8080`.
*   Intermediary between Frontend (`localhost:3000`) and Backend (`localhost:9090`).
*   Key functions:
    *   Request/Response Logging
    *   Query Sanitization
    *   Rate Limiting
    *   Security Enforcement
*   `Dockerfile(Middleware)` details its build process.

### 3.4 Backend
*   Provides a GraphQL API for data operations.
*   **Express.js Implementation:**
    *   `models`: Define data structure (Mongoose schemas for MongoDB).
    *   `typeDefs`: GraphQL schema definitions.
    *   `resolvers`: Logic for GraphQL queries and mutations.
    *   `app.js`: Initializes and runs the Apollo Server.
*   **Django Implementation:**
    *   `models` (within app folders): Define database table structure (Django ORM).
    *   `schema.py` (in API directory): Defines GraphQL schema.
    *   `resolvers` (methods in `schema.py` or imported): Logic for GraphQL operations.
*   `Dockerfile(Backend)` details its build process (specify if it's for Node.js/Express or Python/Django).

### 3.5 Non-Functional Requirements Highlights
*   **Scalability:** Designed to handle peak traffic using Docker and orchestration tools (like Kubernetes, conceptually).
*   **Performance:** Fast API responses and optimized container startup times.
*   **Portability & Maintainability:** Docker ensures consistent environments.
*   **Security:** Encrypted data transmission, secure credential storage, robust JWT authentication.
*   **Disaster Recovery:** Regular backups, centralized logging, real-time monitoring.
*   **CI/CD:** Well-integrated pipeline for smooth deployments.

---

## 4. System Diagrams (Conceptual)

The project report mentions the following diagrams were part of the design process:

*   Use Case Diagram
*   User Flow Diagram
*   System Architecture Diagram
*   Component Diagram
*   Entity Relationship Diagram (ERD)

*(Note: The report states the C4 Diagram was not completed due to time constraints. If these diagrams are available as image files, consider linking them here or adding them to a `/docs/diagrams` folder in the repository.)*

---

## 5. Getting Started

### 5.1 Prerequisites
*   Docker: [Install Docker](https://docs.docker.com/get-docker/)
*   Docker Compose: [Install Docker Compose](https://docs.docker.com/compose/install/) (often included with Docker Desktop)

### 5.2 Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd vero-thrift-store # Or your repository name
    ```

2.  **Environment Variables:**
    If there are `.env.example` files for any service (frontend, middleware, backend), copy them to `.env` and configure the necessary variables (e.g., database connection strings, API keys).
    ```bash
    cp frontend/.env.example frontend/.env
    cp middleware/.env.example middleware/.env
    cp backend/.env.example backend/.env
    # Then edit the .env files
    ```

3.  **Build and run the application using Docker Compose:**
    ```bash
    docker-compose up --build -d
    ```
    *   `--build`: Forces a rebuild of the images if Dockerfiles have changed.
    *   `-d`: Runs containers in detached mode (in the background).

4.  **Access the application:**
    *   **Frontend:** [http://localhost:3000](http://localhost:3000)
    *   **Middleware Proxy (if accessed directly):** [http://localhost:8080](http://localhost:8080)
    *   **Backend API (e.g., GraphQL Playground if enabled):** [http://localhost:9090/graphql](http://localhost:9090/graphql) (The path `/graphql` is an assumption, adjust if different)

5.  **To stop the application:**
    ```bash
    docker-compose down
    ```

---

## 6. Application Showcase (Highlights)

The platform successfully implements the following features, as demonstrated in the project report:

*   User Authentication: Sign up, Login (Customer & Admin), Logout.
*   Product Discovery:
    *   In-depth Product Searching (Category and Brands)
    *   Trending Pieces
    *   Items on Sale
    *   Limited Items
*   Product Interaction:
    *   Detailed Product Information pages
    *   Wishlist functionality (Add/Remove)
    *   Shopping Cart (Add/Remove, Checkout)
*   Order Management:
    *   Place Order & Order Completion
    *   Customer Order History
*   Support:
    *   Customer Service AI Chatbot
*   Admin Capabilities:
    *   Product Management (CRUD operations)
    *   Order Management (Track order status)

*(Refer to section 3.2 "Application Result" in the original project report for visual showcases.)*

---

**Gigachads**

<a href="https://github.com/Cathe0n/ThriftStore/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Cathe0n/ThriftStore" />
</a>

