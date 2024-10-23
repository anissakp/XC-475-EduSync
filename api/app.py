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

# # FIREBASE IMPLEMENTATION
# import firebase_admin
# from firebase_admin import credentials, firestore, storage

# # Initialize the app with a service account, granting admin privileges
# cred = credentials.Certificate('path/to/serviceAccountKey.json')
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'your-project-id.appspot.com'  # Replace with your bucket name
# })

# # Initialize Firestore
# db = firestore.client()

# def get_syllabus_metadata(user_id, file_name):
#     # Reference to the user's syllabi collection
#     syllabus_ref = db.collection('users').document(user_id).collection('syllabi').document(file_name)
#     doc = syllabus_ref.get()

#     if doc.exists:
#         return doc.to_dict()
#     else:
#         print(f'No syllabus found for {file_name}')
#         return None


# def get_file_url(file_name):
#     bucket = storage.bucket()
#     blob = bucket.blob(f'syllabi/{file_name}')
    
#     if blob.exists():
#         return blob.public_url  # Public URL to access the file
#     else:
#         print(f'File {file_name} does not exist in storage')
#         return None


# def fetch_syllabus(user_id, file_name):
#     # Get syllabus metadata
#     metadata = get_syllabus_metadata(user_id, file_name)

#     if metadata:
#         # Get file URL
#         file_url = get_file_url(file_name)
#         if file_url:
#             # Combine metadata with file URL
#             metadata['file_url'] = file_url
#             return metadata
#     return None


if __name__ == '__main__':
  app.run(host='localhost', port=5000, debug=True)