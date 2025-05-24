import jwt
from flask import request, jsonify
from functools import wraps
from models import User
from config import Config

def generate_token(user_id):
    payload = {"user_id": user_id}
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm="HS256")
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header[7:]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(token, Config.SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                raise Exception("User not found")
        except Exception as e:
            return jsonify({"message": "Token is invalid", "error": str(e)}), 401

        return f(current_user, *args, **kwargs)
    return decorated
