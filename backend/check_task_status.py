"""Check task status values in database"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import text
from src.database import engine

print("📊 Checking task status values...")

with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT id, title, status, is_completed 
        FROM tasks 
        ORDER BY created_at DESC 
        LIMIT 10;
    """))
    
    print("\nRecent tasks:")
    for row in result:
        print(f"  - {row.title[:40]:40} | Status: {row.status:12} | Completed: {row.is_completed}")
