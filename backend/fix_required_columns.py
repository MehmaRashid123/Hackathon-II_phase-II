"""Make priority and status columns nullable"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from src.database import engine

print("🔧 Making priority and status columns nullable...")

# Make priority nullable
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks ALTER COLUMN priority DROP NOT NULL;"))
        print("✅ Made priority nullable")
except Exception as e:
    print(f"⚠️  priority: {e}")

# Make status nullable
try:
    with engine.begin() as conn:
        conn.execute(text("ALTER TABLE tasks ALTER COLUMN status DROP NOT NULL;"))
        print("✅ Made status nullable")
except Exception as e:
    print(f"⚠️  status: {e}")

print("\n✅ Columns are now nullable!")
