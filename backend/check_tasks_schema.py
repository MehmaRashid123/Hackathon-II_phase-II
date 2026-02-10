"""Check the actual schema of the tasks table"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from sqlalchemy import inspect
from src.database import engine

inspector = inspect(engine)

print("📋 Tasks table columns:")
for column in inspector.get_columns('tasks'):
    print(f"  - {column['name']}: {column['type']} (nullable={column['nullable']})")
