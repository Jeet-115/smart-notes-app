from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from routes import note_routes

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

db.init_app(app)
app.register_blueprint(note_routes, url_prefix="/api")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
