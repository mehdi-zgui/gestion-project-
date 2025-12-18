# backend/tests/conftest.py
from datetime import date, datetime
import pytest
import sqlite3
import importlib.util
import sys
from pathlib import Path

# SQLite datetime adapters

sqlite3.register_adapter(datetime, lambda d: d.isoformat())
sqlite3.register_adapter(date, lambda d: d.isoformat())


# Charge directement backend/app.py en tant que module partagé "app_module_for_tests"
app_path = Path(__file__).resolve().parent.parent / "app.py"
if not app_path.exists():
    raise FileNotFoundError(f"Impossible de trouver app.py au chemin : {app_path}")

spec = importlib.util.spec_from_file_location("app_module_for_tests", str(app_path))
APP_MODULE = importlib.util.module_from_spec(spec)
sys.modules["app_module_for_tests"] = APP_MODULE
spec.loader.exec_module(APP_MODULE)

# Récupère l'objet Flask app
APP = getattr(APP_MODULE, "app", None)
if APP is None:
    raise RuntimeError("Le module app importé ne contient pas d'objet 'app' (Flask)")

# --- Wrappers pour simuler mysql.connector.cursor(dictionary=True) ---
class SQLiteCursorWrapper:
    def __init__(self, cur, dict_mode=False):
        self._cur = cur
        self._dict = dict_mode

    def _convert_placeholders(self, sql, params):
        """
        Convertit les placeholders MySQL '%s' en placeholders sqlite '?'
        en respectant le nombre d'occurrences.
        """
        if isinstance(sql, str) and "%s" in sql:
            # Simple remplacement global (MySQL -> sqlite)
            new_sql = sql.replace("%s", "?")
            return new_sql, params
        return sql, params

    def execute(self, sql, params=None):
        if params is None:
            params = ()
        sql_conv, params_conv = self._convert_placeholders(sql, params)
        return self._cur.execute(sql_conv, params_conv)

    def executemany(self, sql, seq_of_params):
        sql_conv, _ = self._convert_placeholders(sql, ())
        return self._cur.executemany(sql_conv, seq_of_params)

    def fetchone(self):
        row = self._cur.fetchone()
        if row is None:
            return None
        if self._dict:
            keys = [desc[0] for desc in self._cur.description]
            return {k: row[idx] for idx, k in enumerate(keys)}
        return row

    def fetchall(self):
        rows = self._cur.fetchall()
        if self._dict:
            keys = [desc[0] for desc in self._cur.description]
            return [{k: row[idx] for idx, k in enumerate(keys)} for row in rows]
        return rows

    @property
    def lastrowid(self):
        return self._cur.lastrowid

    def close(self):
        try:
            self._cur.close()
        except Exception:
            pass

class SQLiteConnectionWrapper:
    def __init__(self, conn):
        self._conn = conn

    def cursor(self, dictionary=False):
        cur = self._conn.cursor()
        return SQLiteCursorWrapper(cur, dict_mode=dictionary)

    def commit(self):
        return self._conn.commit()

    def rollback(self):
        return self._conn.rollback()

    def close(self):
        # on garde la connexion ouverte (gérée par la fixture)
        pass

# --- Fixture sqlite in-memory avec schema  ---
@pytest.fixture(scope="session")
def sqlite_conn():
    conn = sqlite3.connect(":memory:", check_same_thread=False)
    cur = conn.cursor()
    
    cur.execute("""
    CREATE TABLE utilisateurs (
        id_util INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        telephone TEXT,
        fonction TEXT,
        date_naiss TEXT,
        address TEXT
    )""")
    cur.execute("CREATE TABLE etat (id INTEGER PRIMARY KEY AUTOINCREMENT, nom TEXT)")
    cur.execute("CREATE TABLE images (id_img INTEGER PRIMARY KEY AUTOINCREMENT, url TEXT, date TEXT)")
    cur.execute("""
    CREATE TABLE zone_urbaines (
        id_zone INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        superficie TEXT,
        population TEXT,
        address TEXT,
        image_id INTEGER
    )""")
    cur.execute("""
    CREATE TABLE project (
        id_pro INTEGER PRIMARY KEY AUTOINCREMENT,
        nom TEXT,
        date_debut TEXT,
        date_fin TEXT,
        cout REAL,
        etat_id INTEGER,
        zone_id INTEGER
    )""")
    conn.commit()
    cur.close()
    yield conn
    conn.close()

# --- Fixture app qui monkeypatch get_db_connection() ---
@pytest.fixture
def app(sqlite_conn, tmp_path, monkeypatch):
    def _get_db_connection():
        return SQLiteConnectionWrapper(sqlite_conn)

    # Remplace la fonction get_db_connection définie dans app.py
    monkeypatch.setattr(APP_MODULE, "get_db_connection", _get_db_connection)

    # Expose la connexion sqlite brute pour insertion directe depuis les tests
    setattr(APP_MODULE, "_test_sqlite_conn", sqlite_conn)

    # Configure dossier uploads temporaire
    upload_dir = tmp_path / "uploads"
    upload_dir.mkdir()
    APP.config['UPLOAD_FOLDER'] = str(upload_dir)
    APP.config['TESTING'] = True
    yield APP

@pytest.fixture
def client(app):
    return app.test_client()
