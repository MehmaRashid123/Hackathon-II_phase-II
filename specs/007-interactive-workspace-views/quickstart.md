# Quickstart Guide: Interactive Views & Workspace Management

**Spec**: [spec.md](./spec.md)
**Plan**: [plan.md](./plan.md)
**Data Model**: [data-model.md](./data-model.md)
**Date**: 2026-02-08

This guide provides instructions to set up the development environment and run the frontend and backend for the "Interactive Views & Workspace Management" feature.

## 1. Prerequisites

Before you begin, ensure you have the following installed:

*   **Python 3.11+**: For the backend.
*   **Node.js 18+ & npm/yarn**: For the frontend.
*   **Docker & Docker Compose (Optional, but recommended for database)**: For easily running a PostgreSQL database.
*   **Poetry (Recommended for Python dependency management)**: `pip install poetry`
*   **Git**: For version control.

## 2. Backend Setup (`backend/`)

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Install Python dependencies**:
    If using Poetry (recommended):
    ```bash
    poetry install
    poetry shell
    ```
    If using pip:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Database Configuration**:
    Create a `.env` file in the `backend/` directory based on `.env.example`.
    The `DATABASE_URL` should point to your PostgreSQL instance.
    Example `.env` (adjust as necessary):
    ```
    DATABASE_URL="postgresql+asyncpg://user:password@localhost/database_name"
    JWT_SECRET="YOUR_SUPER_SECRET_KEY" # Generate a strong secret
    # ... other environment variables
    ```
    You can run a local PostgreSQL instance using Docker:
    ```bash
    docker-compose up -d postgres # Assuming a docker-compose.yml exists or create one
    ```

4.  **Run Database Migrations**:
    These migrations will create the necessary tables and update existing ones (e.g., `Task` table, new `Workspace`, `Project`, `Activity` tables).
    ```bash
    alembic upgrade head
    ```

5.  **Start the Backend Server**:
    ```bash
    ./start_server.sh
    # Or directly with uvicorn if not using the script:
    # uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
    ```
    The backend API should now be running on `http://localhost:8000`.

## 3. Frontend Setup (`frontend/`)

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install Node.js dependencies**:
    ```bash
    npm install
    # or yarn install
    ```

3.  **Environment Configuration**:
    Create a `.env.local` file in the `frontend/` directory based on `.env.local.example`.
    Ensure `NEXT_PUBLIC_BACKEND_URL` points to your backend API.
    Example `.env.local`:
    ```
    NEXT_PUBLIC_BACKEND_URL="http://localhost:8000/api"
    # ... other frontend environment variables
    ```

4.  **Start the Frontend Development Server**:
    ```bash
    npm run dev
    # or yarn dev
    ```
    The frontend application should now be accessible at `http://localhost:3000`.

## 4. Testing the Features

### Kanban Board

1.  Access the dashboard in your browser (e.g., `http://localhost:3000/dashboard/kanban`).
2.  Log in or register a new user.
3.  Ensure you have created at least one workspace and some tasks associated with it.
4.  Drag tasks between the "To Do", "In Progress", "Review", and "Done" columns. Verify that the task status updates visually and (ideally) by checking the backend API or database.

### Analytics Dashboard

1.  Navigate to the analytics section (e.g., `http://localhost:3000/dashboard/analytics`).
2.  Verify that charts for status distribution, priority breakdown, and completion trends are displayed correctly based on your task data.
3.  Try filtering by project if that functionality is implemented.

### Workspace Switcher

1.  If you have multiple workspaces, use the workspace switcher (likely in the sidebar) to switch between them.
2.  Observe that the Kanban board, task lists, and analytics update to reflect the data of the currently selected workspace.

### Billing Page

1.  Go to the billing section (e.g., `http://localhost:3000/dashboard/billing`).
2.  Verify that the subscription plan cards (Free, Pro, Business) are displayed with features and pricing.
3.  Test responsiveness by resizing your browser window.

### Activity Feed

1.  While in a workspace, perform actions like creating tasks, changing their status, etc.
2.  Observe the activity feed (likely in a dedicated component) for real-time updates of these actions.

## 5. Key Libraries/Tools Used

*   **Backend**: FastAPI, SQLModel, Alembic, Uvicorn, PostgreSQL
*   **Frontend**: Next.js, React, recharts, dnd-kit, Tailwind CSS, TypeScript
*   **Testing**: Pytest (backend), Jest/React Testing Library (frontend)

This quickstart guide covers the essential steps to get the application running and test the newly implemented features.
