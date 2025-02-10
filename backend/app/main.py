from flask import Flask, request, jsonify
import json
import uuid
from flask_cors import CORS  # Import CORS to handle cross-origin requests

app = Flask(__name__)

# Enable CORS for all domains (adjust as needed)
CORS(app)

# File path to the JSON database
CHAT_FILE = './db/chat.json'

# Helper function to load and save data


def load_data():
    try:
        with open(CHAT_FILE, 'r') as file:
            return json.load(file)
    except Exception as e:
        print(f"Error loading data: {e}")
        return {"rooms": []}  # Return empty rooms if there's an error


def save_data(data):
    try:
        with open(CHAT_FILE, 'w') as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        print(f"Error saving data: {e}")

# Route to fetch all chat rooms


@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    data = load_data()
    return jsonify({"rooms": data['rooms']})

# Route to create chat rooms


@app.route('/api/rooms', methods=['POST'])
def create_chatroom():
    room_name = request.json.get('name')
    room_type = request.json.get('infoZip')

    if not room_name:
        return jsonify({"error": "Room name is required"}), 400

    data = load_data()

    # Check if the room name already exists
    if any(room['name'] == room_name for room in data['rooms']):
        return jsonify({"error": f"Room name '{room_name}' is already taken"}), 400

    # Create a new room with a unique ID and empty messages list
    new_room = {
        "id": str(uuid.uuid4()),  # Generate a unique ID for the room
        "name": room_name,
        "infoZip": room_type,
        "messages": []
    }

    data['rooms'].append(new_room)
    save_data(data)

    return jsonify({"message": f"Room '{room_name}' created successfully", "room": new_room})

# Route to fetch messages for a specific room by ID


@app.route('/api/rooms/<room_id>', methods=['GET'])
def get_messages(room_id):
    data = load_data()
    room = next((room for room in data['rooms']
                if room['id'] == room_id), None)

    if not room:
        return jsonify({"error": "Room not found"}), 404

    return jsonify({"messages": room['messages']})

# Route to delete a chat room by ID


@app.route('/api/rooms/<room_id>', methods=['DELETE'])
def delete_chatroom(room_id):
    data = load_data()

    # Find the room to delete
    room_to_delete = next(
        (room for room in data['rooms'] if room['id'] == room_id), None)

    if not room_to_delete:
        return jsonify({"error": "Room not found"}), 404

    # Remove the room from the list
    data['rooms'] = [room for room in data['rooms'] if room['id'] != room_id]
    save_data(data)

    return jsonify({"message": "Room   deleted successfully"})


if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Ensure the correct port
