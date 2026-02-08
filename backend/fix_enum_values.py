"""
Fix enum values in database to match Python code
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        # Drop and recreate status enum with correct values
        print("Updating status enum...")
        
        # First, alter the column to use text temporarily
        session.exec(text("""
            ALTER TABLE tasks 
            ALTER COLUMN status TYPE TEXT
        """))
        
        # Drop the old enum
        session.exec(text("""
            DROP TYPE IF EXISTS statusenum CASCADE
        """))
        
        # Create new enum with correct values
        session.exec(text("""
            CREATE TYPE statusenum AS ENUM ('TO_DO', 'IN_PROGRESS', 'REVIEW', 'DONE')
        """))
        
        # Convert column back to enum
        session.exec(text("""
            ALTER TABLE tasks 
            ALTER COLUMN status TYPE statusenum USING status::statusenum
        """))
        
        print("✅ Status enum updated")
        
        # Do the same for priority enum
        print("Updating priority enum...")
        
        session.exec(text("""
            ALTER TABLE tasks 
            ALTER COLUMN priority TYPE TEXT
        """))
        
        session.exec(text("""
            DROP TYPE IF EXISTS priorityenum CASCADE
        """))
        
        session.exec(text("""
            CREATE TYPE priorityenum AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT')
        """))
        
        session.exec(text("""
            ALTER TABLE tasks 
            ALTER COLUMN priority TYPE priorityenum USING priority::priorityenum
        """))
        
        print("✅ Priority enum updated")
        
        session.commit()
        print("\n✅ All enum values updated successfully")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        session.rollback()
