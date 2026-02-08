"""
Test full flow: registration, login, workspace creation
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_registration():
    """Test user registration"""
    print("\n1. Testing Registration...")
    response = requests.post(
        f"{BASE_URL}/api/auth/signup",
        json={
            "email": "testuser@example.com",
            "password": "TestPassword123!"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    return response.status_code in [200, 201, 400]  # 400 if user already exists

def test_login():
    """Test user login"""
    print("\n2. Testing Login...")
    response = requests.post(
        f"{BASE_URL}/api/auth/signin",
        json={
            "email": "testuser@example.com",
            "password": "TestPassword123!"
        }
    )
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Access Token: {data.get('access_token', 'N/A')[:50]}...")
        return data.get("access_token")
    else:
        print(f"Response: {response.text}")
        return None

def test_workspace_creation(token):
    """Test workspace creation"""
    print("\n3. Testing Workspace Creation...")
    response = requests.post(
        f"{BASE_URL}/workspaces",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Workspace",
            "description": "A test workspace"
        }
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    return response.status_code in [200, 201]

def test_get_workspaces(token):
    """Test getting workspaces"""
    print("\n4. Testing Get Workspaces...")
    response = requests.get(
        f"{BASE_URL}/workspaces",
        headers={"Authorization": f"Bearer {token}"}
    )
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    return response.status_code == 200

if __name__ == "__main__":
    print("=" * 60)
    print("FULL FLOW TEST")
    print("=" * 60)
    
    # Test registration (may fail if user exists)
    test_registration()
    
    # Test login
    token = test_login()
    
    if token:
        # Test workspace creation
        test_workspace_creation(token)
        
        # Test getting workspaces
        test_get_workspaces(token)
        
        print("\n" + "=" * 60)
        print("✅ ALL TESTS COMPLETED")
        print("=" * 60)
    else:
        print("\n❌ Login failed, cannot continue tests")
