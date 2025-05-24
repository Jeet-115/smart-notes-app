from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import note_routes

app = Flask(__name__)
app.config.from_object(Config)

# ✅ Allow multiple origins:
CORS(app, origins=[
    "http://localhost:5173",
    "https://smart-notes-app-jeet.vercel.app",
    "https://smart-notes-app-gray.vercel.app"
], supports_credentials=True)

db.init_app(app)
app.register_blueprint(note_routes, url_prefix="/api")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
