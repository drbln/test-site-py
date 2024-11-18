from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt

app = Flask(__name__)

# Настройки для JWT
app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Замените на более сложный ключ
jwt = JWTManager(app)

# Простая база данных пользователей
users = {}

# Регистрация
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Введите имя пользователя и пароль"}), 400

    if username in users:
        return jsonify({"error": "Пользователь уже существует"}), 400

    # Хэшируем пароль
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    users[username] = {"password": hashed_password}
    return jsonify({"message": "Регистрация успешна"}), 201

# Авторизация
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = users.get(username)
    if not user:
        return jsonify({"error": "Неверное имя пользователя или пароль"}), 401

    # Проверяем хэш пароля
    if not bcrypt.checkpw(password.encode('utf-8'), user["password"]):
        return jsonify({"error": "Неверное имя пользователя или пароль"}), 401

    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200

# Закрытая часть
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():
    current_user = get_jwt_identity()
    return jsonify({"message": f"Добро пожаловать, {current_user}! Это закрытая часть сайта."}), 200

if __name__ == '__main__':
    app.run(debug=True)
