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

@app.route("/test-firestore", methods=["GET"])
def test_firestore():
    try:
        # Agregar un documento de prueba en Firestore
        doc_ref = db.collection("testCollection").document("testDocument")
        doc_ref.set({"message": "Firestore connection successful!"})

        # Leer el documento de prueba
        doc = doc_ref.get()
        if doc.exists:
            return jsonify(doc.to_dict()), 200
        else:
            return jsonify({"error": "Document does not exist"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/register", methods=["POST"])
def register():
    email = request.json.get("email")
    password = request.json.get("password")
    try:
        user = auth.create_user_with_email_and_password(email, password)
        return jsonify({"message": "User created successfully", "user_id": user["localId"]}), 201
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
