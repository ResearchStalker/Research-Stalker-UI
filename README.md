# ResearchStalker Client

This client is a React application that uses **TypeScript**, **SCSS** for styling, and **React Router** for navigation. 
It includes interactive visualizations such as the **Searcher** and **Researcher Network** views. 
It supports running locally or using Docker and includes a CI/CD pipeline file for deployment to AWS Amplify and Docker Hub.

---

## Table of Contents

1. [Project Setup](#project-setup)
2. [Running Locally](#running-locally)
3. [Running via Docker](#running-via-docker)
4. [CI/CD Pipeline](#cicd-pipeline)
5. [Folder Structure](#folder-structure)
6. [Views Overview](#views-overview)

---

## Project Setup

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** (v16 or later)
- **npm** (v8 or later)
- **Docker** (v20 or later)

### Install Dependencies

Clone the repository and install project dependencies:

```bash
git clone <https://github.com/MikoMikarro/ResearchStalker>
cd client
npm install
```

---

## Running Locally

To run the React application locally:

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Running via Docker

### Using Docker Compose

To run the application with Docker Compose:

1. Build and start the container using `docker-compose`:
```bash
   docker-compose up --build
```
The app will be accessible at `http://localhost:8080`

## CI/CD Pipeline

The project includes a **GitHub Actions** CI/CD pipeline for building and pushing the Docker image to **Docker Hub**.

### Setting Up CI/CD

1. Add the following **secrets** in your GitHub repository settings:
    - `DOCKER_USERNAME`: Your Docker Hub username.
    - `DOCKER_PASSWORD`: Your Docker Hub password or access token.

2. Push to the `master` branch to trigger the CI/CD pipeline.

3. The AWS Amplify CI/CD has been set up via AWS UI, using the `amplify.yml` file for configuration
---

## Folder Structure

The project is organized as follows:

```plaintext
client/
│
├── public/               # Static files (mock dataset)
├── src/                  # Source code
│   ├── views/            # Views
│   │   ├── Menu.tsx
│   │   └── ResearcherNetwork.tsx
│   │
│   ├── styles/           # SCSS stylesheets
│   ├── App.tsx           # Main App component
│   ├── assets/           # Assets folder
│   └── Index.tsx         # Index React file 
│
├── Dockerfile            # Dockerfile for building the app
├── .github/              # CI/CD workflows
│   └── workflows/
│       └── ci-cd.yml     # GitHub Actions CI/CD workflow
│
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies
├── amplify.yml           # Amplify ci/cd yml
├── .gitignore            # Files to ignore in Git
└── README.md             # Project documentation


```