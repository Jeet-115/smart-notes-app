from flask import Blueprint, request, jsonify
from models import db, Note, User
from auth_utils import generate_token, token_required

note_routes = Blueprint("note_routes", __name__)

@note_routes.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter((User.username == username) | (User.email == email)).first():
        return jsonify({"message": "User with that username or email already exists"}), 400

    user = User(username=username, email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)
    return jsonify({"token": token, "user": {"id": user.id, "username": user.username, "email": user.email}}), 201

@note_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_token(user.id)
    return jsonify({"token": token, "user": {"id": user.id, "username": user.username, "email": user.email}})

@note_routes.route("/notes", methods=["GET"])
@token_required
def get_notes(current_user):
    notes = Note.query.filter_by(user_id=current_user.id).all()
    return jsonify([{
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "tags": note.tags,
        "pinned": note.pinned,
        "created_at": note.created_at
    } for note in notes])

@note_routes.route("/notes", methods=["POST"])
@token_required
def create_note(current_user):
    data = request.get_json()
    note = Note(
        title=data.get("title"),
        content=data.get("content"),
        tags=data.get("tags"),
        pinned=data.get("pinned", False),
        user_id=current_user.id
    )
    db.session.add(note)
    db.session.commit()
    return jsonify({"message": "Note created"}), 201

@note_routes.route("/notes/<int:id>", methods=["PUT"])
@token_required
def update_note(current_user, id):
    data = request.get_json()
    note = Note.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    note.title = data.get("title", note.title)
    note.content = data.get("content", note.content)
    note.tags = data.get("tags", note.tags)
    if "pinned" in data:
        note.pinned = data["pinned"]
    db.session.commit()
    return jsonify({"message": "Note updated"})

@note_routes.route("/notes/<int:id>", methods=["DELETE"])
@token_required
def delete_note(current_user, id):
    note = Note.query.filter_by(id=id, user_id=current_user.id).first_or_404()
    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"})
@note_routes.route("/db-test", methods=["GET"])
@note_routes.route("/db-test", methods=["GET"])
def db_test():
    try:
        count = Note.query.count()
        return jsonify({"success": True, "note_count": count})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
