# app.py

from flask import Flask
from config import firebaseConfig
import pyrebase

app = Flask(__name__)

# Initialize Firebase
firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()

@app.route("/")
def home():
    return "Server is running and connected to Firebase!"

if __name__ == "__main__":
    app.run(debug=True)
