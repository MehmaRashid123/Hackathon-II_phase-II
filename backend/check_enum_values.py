"""
Check and fix enum values in database
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        # Check current enum values
        result = session.exec(text("""
            SELECT enumlabel 
            FROM pg_enum 
            WHERE enumtypid = (
                SELECT oid 
                FROM pg_type 
                WHERE typname = 'statusenum'
            )
        """))
        
        print("Current status enum values:")
        for row in result:
            print(f"  - {row}")
        
        # Check priority enum
        result = session.exec(text("""
            SELECT enumlabel 
            FROM pg_enum 
            WHERE enumtypid = (
                SELECT oid 
                FROM pg_type 
                WHERE typname = 'priorityenum'
            )
        """))
        
        print("\nCurrent priority enum values:")
        for row in result:
            print(f"  - {row}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
