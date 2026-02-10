"""Fix tasks table schema to match the application code"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from src.database import engine

print("🔧 Fixing tasks table schema...")

with engine.connect() as conn:
    # Add user_id column if it doesn't exist
    try:
        conn.execute(text("""
            ALTER TABLE tasks 
            ADD COLUMN IF NOT EXISTS user_id UUID;
        """))
        print("✅ Added user_id column")
    except Exception as e:
        print(f"⚠️  user_id column: {e}")
    
    # Add is_completed column if it doesn't exist
    try:
        conn.execute(text("""
            ALTER TABLE tasks 
            ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;
        """))
        print("✅ Added is_completed column")
    except Exception as e:
        print(f"⚠️  is_completed column: {e}")
    
    # Migrate data: set user_id from created_by
    try:
        conn.execute(text("""
            UPDATE tasks 
            SET user_id = created_by 
            WHERE user_id IS NULL AND created_by IS NOT NULL;
        """))
        print("✅ Migrated user_id from created_by")
    except Exception as e:
        print(f"⚠️  Migration: {e}")
    
    # Migrate data: set is_completed based on status
    try:
        conn.execute(text("""
            UPDATE tasks 
            SET is_completed = (status = 'COMPLETED' OR completed_at IS NOT NULL)
            WHERE is_completed IS NULL;
        """))
        print("✅ Migrated is_completed from status/completed_at")
    except Exception as e:
        print(f"⚠️  Migration: {e}")
    
    # Make user_id NOT NULL
    try:
        conn.execute(text("""
            ALTER TABLE tasks 
            ALTER COLUMN user_id SET NOT NULL;
        """))
        print("✅ Made user_id NOT NULL")
    except Exception as e:
        print(f"⚠️  user_id NOT NULL: {e}")
    
    # Add foreign key constraint
    try:
        conn.execute(text("""
            ALTER TABLE tasks 
            ADD CONSTRAINT fk_tasks_user_id 
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        """))
        print("✅ Added foreign key constraint")
    except Exception as e:
        print(f"⚠️  Foreign key: {e}")
    
    conn.commit()
    print("\n✅ Schema migration completed!")
