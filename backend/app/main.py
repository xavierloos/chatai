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
    room_name = request.json.get('roomName')

    if not room_name:
        return jsonify({"error": "Room name is required"}), 400

    data = load_data()

    # Create a new room with a unique ID and empty messages list
    new_room = {
        "id": str(uuid.uuid4()),  # Generate a unique ID for the room
        "name": room_name,
        "type": room_type,
        "messages": []
    }

    data['rooms'].append(new_room)
    save_data(data)

    return jsonify({"message": f"Room '{room_name}' created successfully", "room": new_room})

# Route to post a message to a specific room by ID


@app.route('/api/rooms/<room_id>', methods=['POST'])
def post_message(room_id):
    message = request.json.get('chat')

    if not message:
        return jsonify({"error": "Message data is required"}), 400

    data = load_data()
    room = next((room for room in data['rooms']
                if room['id'] == room_id), None)

    if not room:
        return jsonify({"error": "Room not found"}), 404

    room['messages'].append(message)
    save_data(data)

    return jsonify({"message": "Message sent successfully"})


if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Ensure the correct port
