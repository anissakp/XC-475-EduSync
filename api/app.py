from flask import Flask, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)

# allow CORS for requests from 'http://localhost:5173'
# will need to update this in the deployment version probably
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

@app.route("/data")
@cross_origin(origin="http://localhost:5173")

def get_data():
  data = {'message': 'Hello from Flask!'}
  return jsonify(data)

if __name__ == '__main__':
  app.run(host='localhost', port=5000, debug=True)