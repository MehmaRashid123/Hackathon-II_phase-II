"""
Check current logged in user
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

data = login_response.json()
print(f"✅ Logged in as: {data.get('email')}")
print(f"   User ID: {data.get('user_id')}")
print(f"   Token: {data['access_token'][:50]}...")

# Check user's workspaces
token = data['access_token']
workspaces_response = requests.get(
    "http://localhost:8000/workspaces",
    headers={"Authorization": f"Bearer {token}"}
)

if workspaces_response.status_code == 200:
    workspaces = workspaces_response.json()
    print(f"\n✅ User has access to {len(workspaces)} workspaces:")
    for ws in workspaces:
        print(f"   - {ws['name']} (ID: {ws['id']})")
else:
    print(f"\n❌ Failed to fetch workspaces: {workspaces_response.text}")
