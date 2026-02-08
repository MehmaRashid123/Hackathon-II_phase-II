"""
List all workspaces
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        result = session.exec(text("""
            SELECT id, name, created_by 
            FROM workspace
            ORDER BY created_at DESC
        """))
        
        print("Available workspaces:")
        for row in result:
            print(f"  ID: {row[0]}")
            print(f"  Name: {row[1]}")
            print(f"  Created by: {row[2]}")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")
