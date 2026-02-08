"""
Test fetching tasks via API
"""
import requests

# Login first
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

# Fetch tasks
workspace_id = "2a373ba6-3b7e-4da3-a5a0-bc83f7fb31fe"
fetch_response = requests.get(
    f"http://localhost:8000/api/workspaces/{workspace_id}/tasks",
    headers={"Authorization": f"Bearer {token}"}
)

print(f"\nFetch Tasks Response:")
print(f"Status: {fetch_response.status_code}")

if fetch_response.status_code == 200:
    tasks = fetch_response.json()
    print(f"✅ Found {len(tasks)} tasks")
    for task in tasks:
        print(f"\n  Task: {task['title']}")
        print(f"  Status: {task['status']}")
        print(f"  Priority: {task['priority']}")
        print(f"  ID: {task['id']}")
else:
    print(f"❌ Failed to fetch tasks: {fetch_response.text}")
