from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import ollama 

app = Flask(__name__)

# Allow CORS for requests from 'http://localhost:5173'
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route("/superdata", methods=['POST'])
@cross_origin(origin='http://localhost:5173')

def get_data():
    print("hello here")
    data = request.json
    print(data) 
    question = data.get('question')
    response = ollama.generate(model='llama3.2', prompt=question)
    print(response)
    return jsonify({"response": response})

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)

