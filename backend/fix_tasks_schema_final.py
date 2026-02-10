"""Fix tasks table schema - final version with proper commits"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from src.database import engine

print("🔧 Fixing tasks table schema (final)...")

# Add user_id column
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS user_id UUID;"))
        print("✅ Added user_id column")
except Exception as e:
    print(f"⚠️  user_id column: {e}")

# Add is_completed column
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_completed BOOLEAN DEFAULT FALSE;"))
        print("✅ Added is_completed column")
except Exception as e:
    print(f"⚠️  is_completed column: {e}")

# Migrate user_id from created_by
try:
    with engine.begin() as conn:
        result = conn.execute(text("UPDATE tasks SET user_id = created_by WHERE user_id IS NULL AND created_by IS NOT NULL;"))
        print(f"✅ Migrated user_id from created_by ({result.rowcount} rows)")
except Exception as e:
    print(f"⚠️  Migrate user_id: {e}")

# Set is_completed based on completed_at
try:
    with engine.begin() as conn:
        result = conn.execute(text("UPDATE tasks SET is_completed = (completed_at IS NOT NULL);"))
        print(f"✅ Set is_completed based on completed_at ({result.rowcount} rows)")
except Exception as e:
    print(f"⚠️  Set is_completed: {e}")

# Make user_id NOT NULL
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;"))
        print("✅ Made user_id NOT NULL")
except Exception as e:
    print(f"⚠️  user_id NOT NULL: {e}")

# Add foreign key
try:
    with engine.begin() as conn:
        conn.execute(text("""
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_tasks_user_id') THEN
                    ALTER TABLE tasks ADD CONSTRAINT fk_tasks_user_id 
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
                END IF;
            END $$;
        """))
        print("✅ Added foreign key constraint")
except Exception as e:
    print(f"⚠️  Foreign key: {e}")

# Add index
try:
    with engine.begin() as conn:
        conn.execute(text("CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);"))
        print("✅ Added index on user_id")
except Exception as e:
    print(f"⚠️  Index: {e}")

print("\n✅ Schema migration completed!")
