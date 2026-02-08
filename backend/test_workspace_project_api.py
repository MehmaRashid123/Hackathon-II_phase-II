from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from backend.src.main import app
from backend.src.config import settings
from backend.src.database import get_session
import pytest
from typing import Generator
import uuid

# --- Test Database Setup ---
# Use an in-memory SQLite database for testing
testing_engine = create_engine("sqlite:///./test.db")


@pytest.fixture(name="session")
def session_fixture() -> Generator[Session, None, None]:
    SQLModel.metadata.create_all(testing_engine)  # Create tables
    with Session(testing_engine) as session:
        yield session
    SQLModel.metadata.drop_all(testing_engine)  # Drop tables after tests


@pytest.fixture(name="client")
def client_fixture(session: Session) -> Generator[TestClient, None, None]:
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()

# --- Helper Functions (Simulate User Login) ---
def get_auth_headers(client: TestClient, email: str, password: str) -> dict:
    response = client.post(
        "/auth/login",
        json={"email": email, "password": password}
    )
    assert response.status_code == 200, response.text
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def register_and_login_user(client: TestClient, email: str, password: str) -> tuple[dict, uuid.UUID]:
    response = client.post(
        "/auth/register",
        json={"email": email, "password": password}
    )
    assert response.status_code == 201, response.text
    user_id = response.json()["id"]
    headers = get_auth_headers(client, email, password)
    return headers, user_id

# --- Test Cases ---

def test_create_workspace(client: TestClient):
    headers, user_id = register_and_login_user(client, "test1@example.com", "securepassword")

    response = client.post(
        "/workspaces/",
        headers=headers,
        json={"name": "My First Workspace", "description": "A personal workspace"}
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["name"] == "My First Workspace"
    assert data["description"] == "A personal workspace"
    assert data["created_by"] == user_id
    assert len(data["members"]) == 1
    assert data["members"][0]["user_id"] == user_id
    assert data["members"][0]["role"] == "owner"

def test_list_workspaces(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test2@example.com", "securepassword")
    headers2, user_id2 = register_and_login_user(client, "test3@example.com", "securepassword")

    # User 1 creates a workspace
    client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "User1's Workspace", "description": "Workspace by User1"}
    )

    # User 2 creates a workspace
    client.post(
        "/workspaces/",
        headers=headers2,
        json={"name": "User2's Workspace", "description": "Workspace by User2"}
    )

    # User 1 lists their workspaces
    response = client.get(
        "/workspaces/",
        headers=headers1
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "User1's Workspace"
    assert data[0]["members"][0]["user_id"] == user_id1

    # User 2 lists their workspaces
    response = client.get(
        "/workspaces/",
        headers=headers2
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "User2's Workspace"
    assert data[0]["members"][0]["user_id"] == user_id2

def test_get_workspace_by_id(client: TestClient):
    headers, user_id = register_and_login_user(client, "test4@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers,
        json={"name": "Workspace to Get", "description": "Description to get"}
    )
    workspace_id = create_response.json()["id"]

    response = client.get(
        f"/workspaces/{workspace_id}",
        headers=headers
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == workspace_id
    assert data["name"] == "Workspace to Get"
    assert data["members"][0]["user_id"] == user_id

def test_get_workspace_by_id_unauthorized(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test5@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Private Workspace", "description": "Should not be seen"}
    )
    workspace_id = create_response.json()["id"]

    _, user_id2 = register_and_login_user(client, "test6@example.com", "securepassword")
    headers2 = get_auth_headers(client, "test6@example.com", "securepassword") # Login as user2

    response = client.get(
        f"/workspaces/{workspace_id}",
        headers=headers2
    )
    assert response.status_code == 404 # Should be 404 because user is not a member

def test_update_workspace(client: TestClient):
    headers, user_id = register_and_login_user(client, "test7@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers,
        json={"name": "Old Name", "description": "Old description"}
    )
    workspace_id = create_response.json()["id"]

    update_payload = {"name": "New Name", "description": "New description"}
    response = client.put(
        f"/workspaces/{workspace_id}",
        headers=headers,
        json=update_payload
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == workspace_id
    assert data["name"] == "New Name"
    assert data["description"] == "New description"

def test_update_workspace_forbidden(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test8@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Workspace", "description": "description"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test9@example.com", "securepassword")
    # Add user2 as a member with MEMBER role
    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1, # Performed by owner
        json={"user_id": str(user_id2), "role": "member"}
    )
    
    # User2 (member) tries to update
    response = client.put(
        f"/workspaces/{workspace_id}",
        headers=headers2,
        json={"name": "Attempt Update"}
    )
    assert response.status_code == 403 # Only owner/admin can update

def test_delete_workspace(client: TestClient):
    headers, user_id = register_and_login_user(client, "test10@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers,
        json={"name": "Workspace to Delete", "description": "Delete this"}
    )
    workspace_id = create_response.json()["id"]

    response = client.delete(
        f"/workspaces/{workspace_id}",
        headers=headers
    )
    assert response.status_code == 204

    # Verify it's deleted
    response = client.get(
        f"/workspaces/{workspace_id}",
        headers=headers
    )
    assert response.status_code == 404

def test_delete_workspace_forbidden(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test11@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Workspace to Protect", "description": "Protected"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test12@example.com", "securepassword")
    # Add user2 as an ADMIN
    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "admin"}
    )

    # User2 (admin) tries to delete
    response = client.delete(
        f"/workspaces/{workspace_id}",
        headers=headers2
    )
    assert response.status_code == 403 # Only owner can delete

# --- Workspace Member Tests ---

def test_add_workspace_member(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test13@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Collab Workspace", "description": "Collaboration space"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test14@example.com", "securepassword")

    response = client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "member"}
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["workspace_id"] == workspace_id
    assert data["user_id"] == user_id2
    assert data["role"] == "member"
    assert "user_email" in data and data["user_email"] == "test14@example.com"

    # Verify user2 can now access the workspace
    response = client.get(
        f"/workspaces/{workspace_id}",
        headers=headers2
    )
    assert response.status_code == 200

def test_add_existing_member_conflict(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test15@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Collab Workspace 2", "description": "Collaboration space 2"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test16@example.com", "securepassword")

    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "member"}
    )
    
    # Try to add again
    response = client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "member"}
    )
    assert response.status_code == 409 # Conflict

def test_add_member_forbidden(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test17@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Collab Workspace 3", "description": "Collaboration space 3"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test18@example.com", "securepassword")
    # Add user2 as a MEMBER
    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "member"}
    )

    headers3, user_id3 = register_and_login_user(client, "test19@example.com", "securepassword")
    # User2 (MEMBER) tries to add user3
    response = client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers2,
        json={"user_id": str(user_id3), "role": "member"}
    )
    assert response.status_code == 403 # Only owner/admin can add

def test_remove_workspace_member(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test20@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Collab Workspace 4", "description": "Collaboration space 4"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test21@example.com", "securepassword")
    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "member"}
    )

    response = client.delete(
        f"/workspaces/{workspace_id}/members/{user_id2}",
        headers=headers1
    )
    assert response.status_code == 204

    # Verify user2 no longer has access
    response = client.get(
        f"/workspaces/{workspace_id}",
        headers=headers2
    )
    assert response.status_code == 404

def test_remove_last_owner_forbidden(client: TestClient):
    headers, user_id = register_and_login_user(client, "test22@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers,
        json={"name": "Single Owner Workspace", "description": "Only one owner"}
    )
    workspace_id = create_response.json()["id"]

    response = client.delete(
        f"/workspaces/{workspace_id}/members/{user_id}",
        headers=headers
    )
    assert response.status_code == 400
    assert "Cannot remove the last owner" in response.json()["detail"]

def test_update_member_role(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test23@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Role Change Workspace", "description": "Change roles here"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test24@example.com", "securepassword")
    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "member"}
    )

    response = client.patch(
        f"/workspaces/{workspace_id}/members/{user_id2}",
        headers=headers1,
        json={"role": "admin"}
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["user_id"] == user_id2
    assert data["role"] == "admin"

    # Verify activities log
    response = client.get(f"/workspaces/{workspace_id}/activities", headers=headers1)
    assert response.status_code == 200
    activities = response.json()
    role_change_activity = next((a for a in activities if a["activity_type"] == "workspace_member_role_changed"), None)
    assert role_change_activity is not None
    assert f"User '{client.get(f'/users/{user_id2}', headers=headers1).json()['email']}' role changed from 'member' to 'admin'" in role_change_activity["description"]


def test_update_member_role_forbidden_admin_to_owner(client: TestClient):
    headers1, user_id1 = register_and_login_user(client, "test25@example.com", "securepassword")
    create_response = client.post(
        "/workspaces/",
        headers=headers1,
        json={"name": "Admin Limits", "description": "Admin cannot promote to owner"}
    )
    workspace_id = create_response.json()["id"]

    headers2, user_id2 = register_and_login_user(client, "test26@example.com", "securepassword")
    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id2), "role": "admin"}
    )

    # User2 (admin) tries to promote someone to owner
    headers3, user_id3 = register_and_login_user(client, "test27@example.com", "securepassword")
    client.post(
        f"/workspaces/{workspace_id}/members",
        headers=headers1,
        json={"user_id": str(user_id3), "role": "member"}
    )
    
    response = client.patch(
        f"/workspaces/{workspace_id}/members/{user_id3}",
        headers=headers2, # Admin
        json={"role": "owner"}
    )
    assert response.status_code == 403
    assert "Admins cannot change owner roles or promote to owner" in response.json()["detail"]

# --- Project Tests ---

def test_create_project(client: TestClient):
    headers, user_id = register_and_login_user(client, "proj1@example.com", "securepassword")
    workspace_response = client.post("/workspaces/", headers=headers, json={"name": "Project Workspace"})
    workspace_id = workspace_response.json()["id"]

    response = client.post(
        f"/workspaces/{workspace_id}/projects",
        headers=headers,
        json={"name": "My First Project", "description": "A new project", "workspace_id": str(workspace_id)}
    )
    assert response.status_code == 201, response.text
    data = response.json()
    assert data["name"] == "My First Project"
    assert data["workspace_id"] == workspace_id
    assert data["created_by"] == user_id

def test_list_projects(client: TestClient):
    headers, user_id = register_and_login_user(client, "proj2@example.com", "securepassword")
    workspace_response = client.post("/workspaces/", headers=headers, json={"name": "Project List Workspace"})
    workspace_id = workspace_response.json()["id"]

    client.post(f"/workspaces/{workspace_id}/projects", headers=headers, json={"name": "Project A", "workspace_id": str(workspace_id)})
    client.post(f"/workspaces/{workspace_id}/projects", headers=headers, json={"name": "Project B", "workspace_id": str(workspace_id)})

    response = client.get(f"/workspaces/{workspace_id}/projects", headers=headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert len(data) == 2
    assert any(p["name"] == "Project A" for p in data)
    assert any(p["name"] == "Project B" for p in data)

def test_get_project_by_id(client: TestClient):
    headers, user_id = register_and_login_user(client, "proj3@example.com", "securepassword")
    workspace_response = client.post("/workspaces/", headers=headers, json={"name": "Single Project Workspace"})
    workspace_id = workspace_response.json()["id"]

    create_response = client.post(f"/workspaces/{workspace_id}/projects", headers=headers, json={"name": "Unique Project", "workspace_id": str(workspace_id)})
    project_id = create_response.json()["id"]

    response = client.get(f"/workspaces/{workspace_id}/projects/{project_id}", headers=headers)
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == project_id
    assert data["name"] == "Unique Project"

def test_update_project(client: TestClient):
    headers, user_id = register_and_login_user(client, "proj4@example.com", "securepassword")
    workspace_response = client.post("/workspaces/", headers=headers, json={"name": "Update Project Workspace"})
    workspace_id = workspace_response.json()["id"]

    create_response = client.post(f"/workspaces/{workspace_id}/projects", headers=headers, json={"name": "Old Project Name", "workspace_id": str(workspace_id)})
    project_id = create_response.json()["id"]

    update_payload = {"name": "New Project Name", "description": "Updated Description"}
    response = client.put(
        f"/workspaces/{workspace_id}/projects/{project_id}",
        headers=headers,
        json=update_payload
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["id"] == project_id
    assert data["name"] == "New Project Name"
    assert data["description"] == "Updated Description"

def test_delete_project(client: TestClient):
    headers, user_id = register_and_login_user(client, "proj5@example.com", "securepassword")
    workspace_response = client.post("/workspaces/", headers=headers, json={"name": "Delete Project Workspace"})
    workspace_id = workspace_response.json()["id"]

    create_response = client.post(f"/workspaces/{workspace_id}/projects", headers=headers, json={"name": "Project to Delete", "workspace_id": str(workspace_id)})
    project_id = create_response.json()["id"]

    response = client.delete(
        f"/workspaces/{workspace_id}/projects/{project_id}",
        headers=headers
    )
    assert response.status_code == 204

    # Verify it's deleted
    response = client.get(
        f"/workspaces/{workspace_id}/projects/{project_id}",
        headers=headers
    )
    assert response.status_code == 404

# --- Activity Logging Tests (partial, deeper testing would be in specific service tests) ---

def test_activity_logging_workspace_created(client: TestClient):
    headers, user_id = register_and_login_user(client, "act1@example.com", "securepassword")
    workspace_name = "Logged Workspace"
    create_response = client.post(
        "/workspaces/",
        headers=headers,
        json={"name": workspace_name, "description": "For activity logging"}
    )
    workspace_id = create_response.json()["id"]

    response = client.get(f"/workspaces/{workspace_id}/activities", headers=headers)
    assert response.status_code == 200
    activities = response.json()
    assert any(a["activity_type"] == "workspace_created" and f"Workspace '{workspace_name}' created." in a["description"] for a in activities)

def test_activity_logging_project_created(client: TestClient):
    headers, user_id = register_and_login_user(client, "act2@example.com", "securepassword")
    workspace_response = client.post("/workspaces/", headers=headers, json={"name": "Activity Proj Ws"})
    workspace_id = workspace_response.json()["id"]
    project_name = "Logged Project"

    client.post(
        f"/workspaces/{workspace_id}/projects",
        headers=headers,
        json={"name": project_name, "description": "Project for activity log", "workspace_id": str(workspace_id)}
    )

    response = client.get(f"/workspaces/{workspace_id}/activities", headers=headers)
    assert response.status_code == 200
    activities = response.json()
    assert any(a["activity_type"] == "project_created" and f"Project '{project_name}' created" in a["description"] for a in activities)

def test_activity_logging_task_created_and_status_changed(client: TestClient):
    headers, user_id = register_and_login_user(client, "act3@example.com", "securepassword")
    workspace_response = client.post("/workspaces/", headers=headers, json={"name": "Activity Task Ws"})
    workspace_id = workspace_response.json()["id"]
    task_title = "Logged Task"

    # Create task
    task_create_response = client.post(
        f"/workspaces/{workspace_id}/tasks",
        headers=headers,
        json={"title": task_title, "status": "todo", "priority": "medium", "workspace_id": str(workspace_id)}
    )
    assert task_create_response.status_code == 201
    task_id = task_create_response.json()["id"]

    # Change status
    client.patch(
        f"/workspaces/{workspace_id}/tasks/{task_id}/status",
        headers=headers,
        json={"status": "in_progress"}
    )

    response = client.get(f"/workspaces/{workspace_id}/activities", headers=headers)
    assert response.status_code == 200
    activities = response.json()
    
    task_created_activity = next((a for a in activities if a["activity_type"] == "task_created" and a["task_id"] == task_id), None)
    assert task_created_activity is not None
    assert f"Task '{task_title}' created" in task_created_activity["description"]

    status_changed_activity = next((a for a in activities if a["activity_type"] == "task_status_changed" and a["task_id"] == task_id), None)
    assert status_changed_activity is not None
    assert f"Task '{task_title}' updated: status from 'todo' to 'in_progress'" in status_changed_activity["description"]
