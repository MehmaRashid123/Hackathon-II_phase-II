"""
Interactive script to setup .env file with proper configuration.
Run this to configure your backend environment variables.
"""
import os
import secrets
from pathlib import Path


def generate_secret_key(length=32):
    """Generate a secure random secret key."""
    return secrets.token_urlsafe(length)


def setup_env():
    """Interactive setup for .env file."""
    print("=" * 60)
    print("Backend Environment Setup")
    print("=" * 60)
    print()
    
    env_path = Path(__file__).parent / ".env"
    
    if env_path.exists():
        print(f"⚠️  .env file already exists at: {env_path}")
        overwrite = input("Do you want to overwrite it? (y/N): ").strip().lower()
        if overwrite != 'y':
            print("Setup cancelled.")
            return
    
    print("\n📝 Let's configure your environment variables:\n")
    
    # Database URL
    print("1. DATABASE_URL")
    print("   Get this from your Neon Console: https://console.neon.tech/")
    print("   Format: postgresql://user:password@host/database")
    database_url = input("   Enter your DATABASE_URL: ").strip()
    
    if not database_url:
        print("   ⚠️  Using placeholder. You MUST update this before running the server!")
        database_url = "postgresql://user:password@localhost:5432/todoapp"
    
    # Secret Key
    print("\n2. BETTER_AUTH_SECRET")
    print("   This should be a strong random string (minimum 32 characters)")
    use_generated = input("   Generate a secure secret key automatically? (Y/n): ").strip().lower()
    
    if use_generated != 'n':
        secret_key = generate_secret_key(32)
        print(f"   ✅ Generated: {secret_key}")
    else:
        secret_key = input("   Enter your secret key: ").strip()
        if len(secret_key) < 32:
            print("   ⚠️  Warning: Secret key should be at least 32 characters!")
    
    # CORS Origins
    print("\n3. CORS_ORIGINS")
    print("   Enter frontend URLs (comma-separated)")
    cors_origins = input("   [http://localhost:3000]: ").strip()
    if not cors_origins:
        cors_origins = "http://localhost:3000,http://localhost:3001"
    
    # Environment
    print("\n4. ENVIRONMENT")
    environment = input("   Enter environment (development/production) [development]: ").strip()
    if not environment:
        environment = "development"
    
    # Write .env file
    env_content = f"""# Database Configuration
DATABASE_URL={database_url}

# Authentication - Shared secret with frontend
BETTER_AUTH_SECRET={secret_key}

# CORS Configuration
CORS_ORIGINS={cors_origins}

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Environment
ENVIRONMENT={environment}
"""
    
    with open(env_path, 'w') as f:
        f.write(env_content)
    
    print("\n" + "=" * 60)
    print("✅ Environment configuration saved to .env")
    print("=" * 60)
    print("\n📋 Next steps:")
    print("   1. Verify your DATABASE_URL is correct")
    print("   2. Run migrations: alembic upgrade head")
    print("   3. Start server: uvicorn src.main:app --reload")
    print("\n💡 Tip: Never commit .env file to version control!")
    print()


if __name__ == "__main__":
    try:
        setup_env()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled.")
    except Exception as e:
        print(f"\n❌ Error: {e}")
