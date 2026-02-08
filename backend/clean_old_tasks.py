"""
Clean old tasks without proper workspace assignment
"""
from src.database import engine
from sqlmodel import Session, text

with Session(engine) as session:
    # Delete all tasks without workspace_id or created_by
    result = session.exec(text("""
        DELETE FROM tasks 
        WHERE created_by IS NULL OR workspace_id IS NULL
        RETURNING id, title
    """))
    
    deleted = result.all()
    session.commit()
    
    print(f"✅ Deleted {len(deleted)} old tasks without proper workspace assignment")
    if deleted:
        print("\nDeleted tasks:")
        for task_id, title in deleted[:10]:  # Show first 10
            print(f"  - {title[:50]}")
        if len(deleted) > 10:
            print(f"  ... and {len(deleted) - 10} more")
