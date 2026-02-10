"""Fix tasks table schema - version 2"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from src.database import engine

print("🔧 Fixing tasks table schema (v2)...")

# Run each statement separately to avoid transaction issues
statements = [
    ("Set is_completed based on completed_at", """
        UPDATE tasks 
        SET is_completed = (completed_at IS NOT NULL)
        WHERE is_completed IS NULL;
    """),
    ("Set default is_completed to false", """
        UPDATE tasks 
        SET is_completed = FALSE
        WHERE is_completed IS NULL;
    """),
    ("Make user_id NOT NULL", """
        ALTER TABLE tasks 
        ALTER COLUMN user_id SET NOT NULL;
    """),
    ("Add foreign key constraint", """
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1 FROM pg_constraint 
                WHERE conname = 'fk_tasks_user_id'
            ) THEN
                ALTER TABLE tasks 
                ADD CONSTRAINT fk_tasks_user_id 
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
            END IF;
        END $$;
    """),
    ("Add index on user_id", """
        CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    """),
]

for description, sql in statements:
    try:
        with engine.begin() as conn:
            conn.execute(text(sql))
            print(f"✅ {description}")
    except Exception as e:
        print(f"⚠️  {description}: {e}")

print("\n✅ Schema migration completed!")
