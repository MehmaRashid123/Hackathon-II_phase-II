"""
Check foreign key constraints on tasks table
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    try:
        result = session.exec(text("""
            SELECT
                tc.constraint_name,
                tc.table_name,
                kcu.column_name,
                ccu.table_name AS foreign_table_name,
                ccu.column_name AS foreign_column_name
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_name = 'tasks'
        """))
        
        print("Foreign key constraints on tasks table:")
        for row in result:
            print(f"  Constraint: {row[0]}")
            print(f"  Column: {row[2]} -> {row[3]}.{row[4]}")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")
