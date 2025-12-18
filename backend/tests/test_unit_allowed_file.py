# backend/tests/test_unit_allowed_file.py
import importlib

# récupère le module partagé chargé par conftest (app_module_for_tests)
app_module = importlib.import_module("app_module_for_tests")
allowed_file = getattr(app_module, "allowed_file", None)

def test_allowed_file_basic():
    assert allowed_file is not None, "La fonction allowed_file n'a pas été trouvée dans app.py"
    assert allowed_file("photo.png")
    assert allowed_file("photo.JPG")
    assert allowed_file("pic.jpeg")
    assert not allowed_file("document.pdf")
    assert not allowed_file("noextension")
