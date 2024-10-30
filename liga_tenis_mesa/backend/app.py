from flask import Flask, request, jsonify
from config import firebaseConfig
import pyrebase
import firebase_admin 
from firebase_admin import credentials, firestore

app = Flask(__name__)

# Initialize Firebase
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

cred = credentials.Certificate("firebase_credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    password = request.json.get("password")
    try:
        # Crear usuario en Firebase Authentication
        user = auth.create_user_with_email_and_password(email, password)
        user_id = user["localId"]

        # Guardar detalles del usuario en Firestore
        user_data = {
            "email": email,
            "user_id": user_id,
            "role": "player",  # Asigna rol predeterminado
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
        user = auth.sign_in_with_email_and_password(email, password)
        return jsonify({"message": "Login successful", "user_id": user["localId"], "idToken": user["idToken"]}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
