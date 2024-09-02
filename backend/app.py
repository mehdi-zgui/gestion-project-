from flask import Flask, request, jsonify, session , send_from_directory
from flask_cors import CORS
from flask_session import Session
import mysql.connector
import bcrypt
from werkzeug.utils import secure_filename
import os
from datetime import datetime


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

UPLOAD_FOLDER = os.path.join('uploads')# Folder to store uploaded images
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}  # Allowed image file extensions
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='1234',
        database='project_management'
    )

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS



@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# SIGN UP : ------------------------------------------------------------------------------------------------------

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    telephone = data.get('telephone')
    fonction = data.get('fonction')
    date_naiss = data.get('date_naiss')
    address = data.get('address')

    if not (name and email and password):
        return jsonify({'message': 'Name, email, and password are required'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO utilisateurs (name, email, password, telephone, fonction, date_naiss, address) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (name, email, hashed_password.decode('utf-8'), telephone, fonction, date_naiss, address)
        )
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({'success': True, 'message': 'User signed up successfully'}), 201
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({'success': False, 'message': 'Failed to sign up user'}), 500

# SIGN IN : 

@app.route('/api/signin', methods=['POST'])
def signin():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not (email and password):
        return jsonify({'message': 'Email and password are required'}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM utilisateurs WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        conn.close()

        if user:
            stored_password = user['password']
            if bcrypt.checkpw(password.encode('utf-8'), stored_password.encode('utf-8')):
                return jsonify({'success': True, 'user': user}), 200
            else:
                return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        else:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({'success': False, 'message': 'Failed to sign in'}), 500


# LOG OUT : ------------------------------------------------------------------------------------------------------

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out successfully'}), 200

# STATUSES : ------------------------------------------------------------------------------------------------------

@app.route('/api/statuses', methods=['GET'])
def get_statuses():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT id, nom FROM etat")
    statuses = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(statuses)

# PAGE ZONE CRUD : ------------------------------------------------------------------------------------------------------

@app.route('/api/zones', methods=['GET'])
def get_zones():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM zone_urbaines")
    zones = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(zones)

@app.route('/api/zones/<int:id_zone>', methods=['GET'])
def get_zone(id_zone):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM zone_urbaines WHERE id_zone = %s", (id_zone,))
    zone = cursor.fetchone()
    cursor.close()
    connection.close()
    return jsonify(zone)

@app.route('/api/zones', methods=['POST'])
def create_zone():
    try:
        data = request.form  # Get form data including uploaded file
        required_fields = ['nom', 'superficie', 'population', 'address']
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        # Check if file is uploaded
        if 'image' not in request.files:
            return jsonify({"error": "Image is required"}), 400

        image_file = request.files['image']
        
        # Check if the file is allowed and save it
        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
            print("File path:", file_path)  # Debugging print statement
            image_file.save(file_path)
            image_url = filename

            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute("""
            INSERT INTO images (url, date) VALUES (%s, %s)
        """, (image_url, datetime.now()))
            connection.commit()
            image_id = cursor.lastrowid
            cursor.execute("""
            INSERT INTO zone_urbaines (nom, superficie, population, address, image_id)
            VALUES (%s, %s, %s, %s, %s)
            """, (data['nom'], data['superficie'], data['population'], data['address'], image_id))
            connection.commit()
            new_id = cursor.lastrowid
            cursor.close()
            connection.close()
            return jsonify({"id_zone": new_id, **data, "image_id": image_id}), 201
        else:
            return jsonify({"error": "Invalid file format"}), 400

    except Exception as e:
        print(f"Error creating zone: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route('/api/zones/<int:id_zone>', methods=['PUT'])
def update_zone(id_zone):
    try:
        data = request.form  # Use request.form for form data
        connection = get_db_connection()
        cursor = connection.cursor()
        
        # Update zone fields
        cursor.execute("""
        UPDATE zone_urbaines SET nom=%s, superficie=%s, population=%s, address=%s WHERE id_zone=%s
        """, (data['nom'], data['superficie'], data['population'], data['address'], id_zone))
        
        # Check if image update is requested
        if 'image_id' in data:
            cursor.execute("""
            UPDATE zone_urbaines SET image_id=%s WHERE id_zone=%s
            """, (data['image_id'], id_zone))
        
        connection.commit()
        cursor.close()
        connection.close()
        return '', 204
    except Exception as e:
        print(f"Error updating zone: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500


@app.route('/api/zones/<int:id_zone>', methods=['DELETE'])
def delete_zone(id_zone):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("SET FOREIGN_KEY_CHECKS=0")
    try:
        cursor.execute("DELETE FROM zone_urbaines WHERE id_zone = %s", (id_zone,))
        connection.commit()
    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.execute("SET FOREIGN_KEY_CHECKS=1")
    cursor.close()
    connection.close()
    return jsonify({"message": "Zone urbaine deleted successfully"}), 204


# PAGE PROJECT CRUD : ------------------------------------------------------------------------------------------------------

@app.route('/api/projects', methods=['GET'])
def get_projects():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("""
    SELECT 
        project.id_pro, project.nom, project.date_debut, project.date_fin, project.cout,
        etat.nom AS etat_nom, zone_urbaines.nom AS zone_nom
    FROM project
    LEFT JOIN etat ON project.etat_id = etat.id
    LEFT JOIN zone_urbaines ON project.zone_id = zone_urbaines.id_zone
    """)
    projects = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(projects)


@app.route('/api/projects', methods=['POST'])
def create_project():
    data = request.json
    # Validate data before processing
    if not all(key in data for key in ['nom', 'date_debut', 'date_fin', 'cout', 'etat_id', 'zone_id']):
        return jsonify({"error": "Incomplete data"}), 400
    
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
        INSERT INTO project (nom, date_debut, date_fin, cout, etat_id, zone_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        """, (data['nom'], data['date_debut'], data['date_fin'], data['cout'], data['etat_id'], data['zone_id']))
        connection.commit()
        new_id = cursor.lastrowid
        
        # Fetch the newly created project details
        cursor.execute("""
        SELECT 
            project.id_pro, project.nom, project.date_debut, project.date_fin, project.cout,
            etat.nom AS etat_nom, zone_urbaines.nom AS zone_nom
        FROM project
        LEFT JOIN etat ON project.etat_id = etat.id
        LEFT JOIN zone_urbaines ON project.zone_id = zone_urbaines.id_zone
        WHERE project.id_pro = %s
        """, (new_id,))
        new_project = cursor.fetchone()
        cursor.close()
        connection.close()
        
        return jsonify(new_project), 201
    except mysql.connector.Error as err:
        print("Error:", err)
        return jsonify({"error": "Database error"}), 500




@app.route('/api/projects/<int:id>', methods=['PUT'])
def update_project(id):
    data = request.json
    # Validate data before processing
    if not all(key in data for key in ['nom', 'date_debut', 'date_fin', 'cout', 'etat_id', 'zone_id']):
        return jsonify({"error": "Incomplete data"}), 400

    # Convert date strings to datetime objects
    try:
        data['date_debut'] = datetime.strptime(data['date_debut'], '%Y-%m-%d')
        data['date_fin'] = datetime.strptime(data['date_fin'], '%Y-%m-%d')
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("""
    UPDATE project SET nom=%s, date_debut=%s, date_fin=%s, cout=%s, etat_id=%s, zone_id=%s 
    WHERE id_pro=%s
    """, (data['nom'], data['date_debut'], data['date_fin'], data['cout'], data['etat_id'], data['zone_id'], id))
    connection.commit()
    cursor.close()
    connection.close()
    return '', 204


@app.route('/api/projects/<int:id_pro>', methods=['DELETE'])
def delete_project(id_pro):
    connection = get_db_connection()
    cursor = connection.cursor()
    cursor.execute("DELETE FROM project WHERE id_pro = %s", (id_pro,))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Project deleted successfully"}), 204

@app.route('/api/images', methods=['GET'])
def get_images():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM images")
    images = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(images)


@app.route('/api/images/<int:id_img>', methods=['GET'])
def get_image(id_img):
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM images WHERE id_img = %s", (id_img,))
    image = cursor.fetchone()
    cursor.close()
    connection.close()
    return jsonify(image)

# UTILISATEURS : ------------------------------------------------------------------------------------------------------

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM utilisateurs')
        users = cursor.fetchall()
        conn.close()
        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        data = request.get_json()

        # Validate input data here
        
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        cursor.execute('INSERT INTO utilisateurs (name, email, password, telephone, fonction, date_naiss, address) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                       (data['name'], data['email'], hashed_password, data['telephone'], data['fonction'], data['date_naiss'], data['address']))
        conn.commit()
        conn.close()
        return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        data = request.get_json()

        # Basic validation: Check if required fields are present
        if 'name' not in data or 'email' not in data:
            return jsonify({"error": "Name and email are required"}), 400

        # Additional validation logic for email format, phone number format, etc.
        # Example: Check if email format is valid
        import re
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', data['email']):
            return jsonify({"error": "Invalid email format"}), 400

        # Update user information in the database
        cursor.execute('UPDATE utilisateurs SET name = %s, email = %s, telephone = %s, fonction = %s, date_naiss = %s, address = %s WHERE id_util = %s',
                       (data['name'], data['email'], data['telephone'], data['fonction'], data['date_naiss'], data['address'], user_id))
        conn.commit()
        conn.close()
        return jsonify({"message": "User updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('DELETE FROM utilisateurs WHERE id_util = %s', (user_id,))
        conn.commit()
        conn.close()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute('SELECT * FROM utilisateurs WHERE id_util = %s', (user_id,))
        user = cursor.fetchone()
        conn.close()
        if user:
            return jsonify(user), 200
        else:
            return jsonify({"error": "User not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
