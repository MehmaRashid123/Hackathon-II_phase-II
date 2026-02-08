"""
Drop is_completed column from tasks table
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        # Drop is_completed column
        session.exec(text("""
            ALTER TABLE tasks 
            DROP COLUMN IF EXISTS is_completed
        """))
        session.commit()
        print("✅ Dropped is_completed column from tasks table")
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
