"""
Add completed_at column to tasks table - Direct PostgreSQL connection
"""
import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database URL from environment
database_url = os.getenv("DATABASE_URL")

if not database_url:
    print("❌ DATABASE_URL not found in .env file")
    exit(1)

try:
    # Connect to database
    conn = psycopg2.connect(database_url)
    cursor = conn.cursor()
    
    # Add completed_at column
    cursor.execute("""
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP
    """)
    
    conn.commit()
    print("✅ Added completed_at column to tasks table")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Error: {e}")
    if conn:
        conn.rollback()
