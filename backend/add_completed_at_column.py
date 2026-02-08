"""
Add completed_at column to tasks table
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        # Add completed_at column
        session.exec(text("""
            ALTER TABLE tasks 
            ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP
        """))
        session.commit()
        print("✅ Added completed_at column to tasks table")
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
