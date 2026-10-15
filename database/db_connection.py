"""
Database Connection Manager (Singleton Pattern & OOP)
Handles MySQL connection pooling, parameterized queries, and transaction rollbacks.
"""

import mysql.connector
from mysql.connector import pooling
from contextlib import contextmanager
from config import get_config

class DatabaseConnection:
    _instance = None
    _pool = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DatabaseConnection, cls).__new__(cls)
            cls._initialize_pool()
        return cls._instance

    @classmethod
    def _initialize_pool(cls):
        config = get_config()
        try:
            cls._pool = pooling.MySQLConnectionPool(
                pool_name="repair_shop_pool",
                pool_size=10,
                pool_reset_session=True,
                host=config.DB_HOST,
                port=config.DB_PORT,
                user=config.DB_USER,
                password=config.DB_PASSWORD,
                database=config.DB_NAME,
                autocommit=False
            )
        except Exception as e:
            # Fallback or initialization note
            cls._pool = None

    @contextmanager
    def get_connection(self):
        """Context manager yielding a MySQL connection with transaction support"""
        conn = None
        try:
            if self._pool:
                conn = self._pool.get_connection()
            else:
                config = get_config()
                conn = mysql.connector.connect(
                    host=config.DB_HOST,
                    port=config.DB_PORT,
                    user=config.DB_USER,
                    password=config.DB_PASSWORD,
                    database=config.DB_NAME,
                    autocommit=False
                )
            yield conn
            conn.commit()
        except Exception as err:
            if conn:
                conn.rollback()
            raise err
        finally:
            if conn:
                conn.close()

    @contextmanager
    def get_cursor(self, dictionary=True):
        """Context manager yielding a cursor for parameterized execution"""
        with self.get_connection() as conn:
            cursor = conn.cursor(dictionary=dictionary)
            try:
                yield cursor
            finally:
                cursor.close()

db = DatabaseConnection()
