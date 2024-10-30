from flask import Flask, request, jsonify
from config import firebaseConfig
import pyrebase
import firebase_admin 
from firebase_admin import credentials, firestore
from functools import wraps
from datetime import datetime

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
    

@app.route("/create-team", methods=["POST"])
@role_required("admin")
def create_team():
    team_name = request.json.get("team_name")
    players = request.json.get("players")  # Esperamos un array con los datos de los jugadores

    if not team_name or not players or len(players) != 4:
        return jsonify({"error": "Team name and exactly four players are required"}), 400

    try:
        # Verificar si el equipo ya existe
        team_ref = db.collection("teams").document(team_name)
        if team_ref.get().exists:
            return jsonify({"error": "Team with this name already exists"}), 400

        # Estructura del equipo
        team_data = {
            "team_name": team_name,
            "players": players,
            "created_at": datetime.now().isoformat()  # Utiliza un string de timestamp en formato ISO
        }
        team_ref.set(team_data)
        return jsonify({"message": "Team created successfully", "team_data": team_data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/create-match", methods=["POST"])
@role_required("admin")
def create_match():
    team1 = request.json.get("team1")
    team2 = request.json.get("team2")
    date = request.json.get("date")  # Fecha del partido en formato ISO

    if not team1 or not team2 or not date:
        return jsonify({"error": "Both teams and a date are required"}), 400

    try:
        # Verificar que los equipos existan
        team1_ref = db.collection("teams").document(team1)
        team2_ref = db.collection("teams").document(team2)
        if not team1_ref.get().exists or not team2_ref.get().exists:
            return jsonify({"error": "One or both teams do not exist"}), 404

        # Crear el partido en Firestore
        match_data = {
            "team1": team1,
            "team2": team2,
            "date": date,
            "result": None  # El resultado se actualizará después del partido
        }
        match_ref = db.collection("matches").add(match_data)
        return jsonify({"message": "Match created successfully", "match_id": match_ref[1].id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/record-result", methods=["POST"])
@role_required("admin")
def record_result():
    match_id = request.json.get("match_id")
    result = request.json.get("result")  # Resultado en formato de string o JSON detallado

    if not match_id or not result:
        return jsonify({"error": "Match ID and result are required"}), 400

    try:
        # Obtener referencia del partido
        match_ref = db.collection("matches").document(match_id)
        if not match_ref.get().exists:
            return jsonify({"error": "Match not found"}), 404

        # Actualizar el resultado del partido
        match_ref.update({"result": result})
        return jsonify({"message": "Result recorded successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
