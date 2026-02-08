import requests
import json

response = requests.post(
    "http://localhost:8000/api/auth/signup",
    json={
        "email": "newuser123@example.com",
        "password": "TestPassword123!"
    }
)

print(f"Status: {response.status_code}")
print(f"Headers: {response.headers}")
print(f"Body: {response.text}")
