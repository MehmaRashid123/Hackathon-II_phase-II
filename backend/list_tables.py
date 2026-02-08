"""
List all tables
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        result = session.exec(text("""
            SELECT tablename 
            FROM pg_tables 
            WHERE schemaname = 'public'
            ORDER BY tablename
        """))
        
        print("Tables in database:")
        for row in result:
            print(f"  - {row[0]}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
