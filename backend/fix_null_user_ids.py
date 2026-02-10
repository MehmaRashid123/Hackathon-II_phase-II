"""Fix NULL user_id values in tasks"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from src.database import engine

print("🔧 Fixing NULL user_id values...")

# Check how many tasks have NULL user_id
with engine.connect() as conn:
    result = conn.execute(text("SELECT COUNT(*) FROM tasks WHERE user_id IS NULL;"))
    null_count = result.scalar()
    print(f"📊 Found {null_count} tasks with NULL user_id")

if null_count > 0:
    # Option 1: Delete tasks with NULL user_id
    print("\n⚠️  These tasks cannot be assigned to a user.")
    print("   Deleting tasks with NULL user_id...")
    
    with engine.begin() as conn:
        result = conn.execute(text("DELETE FROM tasks WHERE user_id IS NULL;"))
        print(f"✅ Deleted {result.rowcount} tasks with NULL user_id")

# Now make user_id NOT NULL
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;"))
        print("✅ Made user_id NOT NULL")
except Exception as e:
    print(f"⚠️  user_id NOT NULL: {e}")

print("\n✅ Cleanup completed!")
