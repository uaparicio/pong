from flask import Flask, request, jsonify
from config import firebaseConfig
import pyrebase
import firebase_admin 
from firebase_admin import credentials, firestore
from functools import wraps

app = Flask(__name__)

# Initialize Firebase
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Obtener idToken del encabezado de la solicitud
            id_token = request.headers.get("Authorization")
            if not id_token:
                return jsonify({"error": "Authorization token required"}), 401

            try:
                # Decodificar token para obtener user_id
                user_info = auth.get_account_info(id_token)
                user_id = user_info["users"][0]["localId"]

                # Obtener datos del usuario desde Firestore
                user_doc = db.collection("users").document(user_id).get()
                if not user_doc.exists:
                    return jsonify({"error": "User not found"}), 404

                user_data = user_doc.to_dict()
                if user_data["role"] != role:
                    return jsonify({"error": "Permission denied"}), 403

                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({"error": str(e)}), 400
        return decorated_function
    return decorator


@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    password = request.json.get("password")
    role = request.json.get("role", "player")  # Por defecto, se asigna el rol de jugador
    try:
        # Crear usuario en Firebase Authentication
        user = auth.create_user_with_email_and_password(email, password)
        user_id = user["localId"]

        # Guardar detalles del usuario en Firestore
        user_data = {
            "email": email,
            "user_id": user_id,
            "role": role,
            "created_at": firestore.SERVER_TIMESTAMP
        }
        db.collection("users").document(user_id).set(user_data)

        return jsonify({"message": "User created successfully", "user_id": user_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/login", methods=["POST"])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    try:
        # Autenticar usuario en Firebase Authentication
        user = auth.sign_in_with_email_and_password(email, password)
        user_id = user["localId"]
        id_token = user["idToken"]

        # Verificar que el usuario exista en Firestore
        doc_ref = db.collection("users").document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            user_data = doc.to_dict()
            return jsonify({"message": "Login successful", "user_data": user_data, "idToken": id_token}), 200
        else:
            return jsonify({"error": "User not found in Firestore"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route("/admin-only", methods=["GET"])
@role_required("admin")
def admin_only():
    return jsonify({"message": "Access granted to admin!"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
