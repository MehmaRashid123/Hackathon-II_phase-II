from src.database import engine
from sqlmodel import text, Session

session = Session(engine)
result = session.exec(text("SELECT tablename FROM pg_tables WHERE schemaname = 'public'"))
tables = [r[0] for r in result.all()]
print("Tables in database:")
for table in sorted(tables):
    print(f"  - {table}")
