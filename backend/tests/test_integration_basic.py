# backend/tests/test_integration_basic.py
import importlib

# récupère le module partagé chargé par conftest (app_module_for_tests)
app_module = importlib.import_module("app_module_for_tests")

def test_signup_then_signin(client):
    payload = {
        "name": "Interviewer",
        "email": "interviewer@test.local",
        "password": "pwd12345",
        "telephone": "0600000000",
        "fonction": "dev",
        "date_naiss": "1990-01-01",
        "address": "Test"
    }
    # Signup
    rv = client.post("/api/signup", json=payload)
    assert rv.status_code == 201
    data = rv.get_json()
    assert data.get("success") is True

    # Signin success
    rv2 = client.post("/api/signin", json={"email": payload["email"], "password": payload["password"]})
    assert rv2.status_code == 200
    d2 = rv2.get_json()
    assert d2.get("success") is True
    assert d2.get("user") and d2["user"]["email"] == payload["email"]

def _insert_etat_zone_direct():
    sqlite_conn = getattr(app_module, "_test_sqlite_conn")
    cur = sqlite_conn.cursor()
    cur.execute("INSERT INTO etat (nom) VALUES (?)", ("En cours",))
    etat_id = cur.lastrowid
    cur.execute("INSERT INTO zone_urbaines (nom, superficie, population, address, image_id) VALUES (?, ?, ?, ?, ?)",
                ("ZoneTest", "100", "1000", "Addr", None))
    zone_id = cur.lastrowid
    sqlite_conn.commit()
    cur.close()
    return etat_id, zone_id

def test_projects_crud(client):
    etat_id, zone_id = _insert_etat_zone_direct()

    # Create project
    payload = {
        "nom": "ProjetTest",
        "date_debut": "2025-01-01",
        "date_fin": "2025-12-31",
        "cout": 1000.0,
        "etat_id": etat_id,
        "zone_id": zone_id
    }
    rv = client.post("/api/projects", json=payload)
    assert rv.status_code == 201
    created = rv.get_json()
    assert created.get("nom") == payload["nom"]
    project_id = created.get("id_pro") or created.get("id_pro")

    # Get list
    rv2 = client.get("/api/projects")
    assert rv2.status_code == 200
    projects = rv2.get_json()
    assert any(p.get("nom") == payload["nom"] for p in projects)

    # Update (nom)
    payload["nom"] = "ProjetUpdated"
    rv3 = client.put(f"/api/projects/{project_id}", json=payload)
    assert rv3.status_code in (200, 204)

    # Delete
    rv4 = client.delete(f"/api/projects/{project_id}")
    assert rv4.status_code in (200, 204)
