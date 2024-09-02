# update_passwords.py
import mysql.connector
import bcrypt

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password='1234',
        database='project_management'
    )

def update_existing_passwords():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_util, password FROM utilisateurs")
        users = cursor.fetchall()

        for user in users:
            if not user['password'].startswith('$2b$'):
                hashed_password = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt())
                cursor.execute("UPDATE utilisateurs SET password = %s WHERE id_util = %s", (hashed_password.decode('utf-8'), user['id_util']))

        conn.commit()
        cursor.close()
        conn.close()
        print("Passwords updated successfully.")
    except mysql.connector.Error as err:
        print("Error:", err)

if __name__ == '__main__':
    update_existing_passwords()
