from sqlalchemy import text

from app.database.session import engine


def test_connection():

    with engine.connect() as connection:

        connection.execute(text("SELECT 1"))

        print("✅ PostgreSQL Connected Successfully!")