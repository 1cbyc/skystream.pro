# SkyStream.pro

**SkyStream.pro** is an open-source, unified NASA-powered Space Intelligence Platform.

The goal of this project is to build a modular web platform that aggregates NASA space and Earth data, enriches it with AI, and exposes highly visual, shareable features like the mood of the day, asteroid impact simulations, birthdate time capsules, a Mars photo curator, and more.

This platform is for space enthusiasts, educators, data journalists, and creative coders.

## Tech Stack

The project is built with a modern, scalable technology stack:

*   **Backend**: Laravel (PHP)
*   **Frontend**: Next.js (React) with TypeScript & Tailwind CSS
*   **Database**: MySQL & Redis
*   **AI**: OpenAI for summarization and embeddings
*   **Storage**: S3-compatible object storage (like MinIO)
*   **Containerization**: Docker
*   **CI/CD**: GitHub Actions

## Getting Started

The entire development environment is containerized using Docker for consistency and ease of setup.

### Prerequisites

*   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/)

### Installation & Running

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/1cbyc/skystream.pro.git
    cd skystream.pro
    ```

2.  **Configure Environment Variables:**
    There are `.env.example` files in both the `backend/` and `frontend/` directories. Copy them to `.env` and fill in the required values, such as your NASA API Key and other service credentials.
    ```sh
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```

3.  **Build and run the application:**
    ```sh
    docker-compose up --build -d
    ```

4.  **Access the application:**
    *   Frontend: [http://localhost:3000](http://localhost:3000)
    *   Backend API: [http://localhost:8000](http://localhost:8000)

## Documentation

For a complete overview of the system architecture, data models, API contracts, and project roadmap, please see the documents in the `/docs` directory.

*   [Project Overview & System Design](./docs/project-overview.txt)

## Contributing

We welcome contributions! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.