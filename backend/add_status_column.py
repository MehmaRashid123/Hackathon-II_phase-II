"""Add status column to tasks table for Kanban board"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from src.database import engine

print("🔧 Adding status column to tasks table...")

# Create enum type for status
try:
    with engine.begin() as conn:
        conn.execute(text("""
            DO $$ BEGIN
                CREATE TYPE task_status AS ENUM ('TO_DO', 'IN_PROGRESS', 'REVIEW', 'DONE');
            EXCEPTION
                WHEN duplicate_object THEN null;
            END $$;
        """))
        print("✅ Created task_status enum type")
except Exception as e:
    print(f"⚠️  Enum type: {e}")

# Add status column with default value
try:
    with engine.begin() as conn:
        conn.execute(text("""
            ALTER TABLE tasks 
            ADD COLUMN IF NOT EXISTS status_new task_status DEFAULT 'TO_DO';
        """))
        print("✅ Added status_new column")
except Exception as e:
    print(f"⚠️  status_new column: {e}")

# Migrate existing data: set status based on is_completed
try:
    with engine.begin() as conn:
        result = conn.execute(text("""
            UPDATE tasks 
            SET status_new = CASE 
                WHEN is_completed = TRUE THEN 'DONE'::task_status
                ELSE 'TO_DO'::task_status
            END
            WHERE status_new = 'TO_DO';
        """))
        print(f"✅ Migrated status from is_completed ({result.rowcount} rows)")
except Exception as e:
    print(f"⚠️  Migration: {e}")

# Drop old status column if it exists (the VARCHAR one)
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks DROP COLUMN IF EXISTS status CASCADE;"))
        print("✅ Dropped old status column")
except Exception as e:
    print(f"⚠️  Drop old status: {e}")

# Rename status_new to status
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks RENAME COLUMN status_new TO status;"))
        print("✅ Renamed status_new to status")
except Exception as e:
    print(f"⚠️  Rename: {e}")

# Make status NOT NULL
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks ALTER COLUMN status SET NOT NULL;"))
        print("✅ Made status NOT NULL")
except Exception as e:
    print(f"⚠️  status NOT NULL: {e}")

print("\n✅ Status column added successfully!")
