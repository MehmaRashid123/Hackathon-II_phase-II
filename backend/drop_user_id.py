"""
Drop user_id column from tasks table
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        # Drop user_id column
        session.exec(text("""
            ALTER TABLE tasks 
            DROP COLUMN IF EXISTS user_id
        """))
        session.commit()
        print("✅ Dropped user_id column from tasks table")
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
