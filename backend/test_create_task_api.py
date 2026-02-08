"""
Test task creation via API
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
print(f"Token: {token[:50]}...")

# Try to create a task
workspace_id = "2a373ba6-3b7e-4da3-a5a0-bc83f7fb31fe"
create_response = requests.post(
    f"http://localhost:8000/api/workspaces/{workspace_id}/tasks",
    headers={"Authorization": f"Bearer {token}"},
    json={
        "title": "Test Task from API",
        "description": "Testing task creation"
    }
)

print(f"\nTask Creation Response:")
print(f"Status: {create_response.status_code}")
print(f"Response: {create_response.text}")

if create_response.status_code == 201:
    print("\n✅ Task created successfully!")
else:
    print(f"\n❌ Task creation failed")
