# auth.py
from flask import jsonify, request
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
import datetime

# In-memory user store (for demonstration)
users = {}

# Create default admin user on startup
# Credentials: username="admin", password="admin123"
users["admin"] = {"password": generate_password_hash("admin123")}

def register_user():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    if username in users:
        return jsonify(message="User already exists"), 400
    
    # Hash password before storing for security
    users[username] = {"password": generate_password_hash(password)}
    return jsonify(message="User registered successfully"), 201

def authenticate_user(username, password):
    user = users.get(username)
    if not user or not check_password_hash(user["password"], password):
        return None
    return user
