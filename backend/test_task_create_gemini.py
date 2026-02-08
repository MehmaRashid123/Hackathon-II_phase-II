"""
Test task creation in gemini workspace
"""
import requests

# Login
login_response = requests.post(
    "http://localhost:8000/api/auth/signin",
    json={
        "email": "testuser@example.com",
        "password": "TestPassword123!"
    }
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

token = login_response.json()["access_token"]
print(f"✅ Logged in successfully")

# Try to create a task in gemini workspace
workspace_id = "1fa6f37a-852d-4548-814a-b288c9eedcf3"
create_response = requests.post(
    f"http://localhost:8000/api/workspaces/{workspace_id}/tasks",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "title": "Test Task in Gemini Workspace",
        "description": "Testing task creation after adding user to workspace"
    }
)

print(f"\nTask Creation Response:")
print(f"Status: {create_response.status_code}")

if create_response.status_code == 201:
    task = create_response.json()
    print(f"✅ Task created successfully!")
    print(f"   Title: {task['title']}")
    print(f"   ID: {task['id']}")
else:
    print(f"❌ Task creation failed")
    print(f"   Response: {create_response.text}")

# Try to fetch tasks
fetch_response = requests.get(
    f"http://localhost:8000/api/workspaces/{workspace_id}/tasks",
    headers={"Authorization": f"Bearer {token}"}
)

print(f"\nFetch Tasks Response:")
print(f"Status: {fetch_response.status_code}")

if fetch_response.status_code == 200:
    tasks = fetch_response.json()
    print(f"✅ Found {len(tasks)} tasks")
else:
    print(f"❌ Failed to fetch tasks")
    print(f"   Response: {fetch_response.text}")
