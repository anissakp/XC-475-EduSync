from flask import Flask, jsonify, request
from flask_cors import CORS
import PyPDF2
import ollama  # Using the downloaded Ollama 3 model locally

app = Flask(__name__)

# Allow CORS for requests from 'http://localhost:5173'
CORS(app, resources={r"/data": {"origins": "http://localhost:5173"}})

import requests
import io
import PyPDF2

# Function to extract text from a PDF file using a Firebase URL
def extract_text_from_pdf_url(pdf_url):
    text = ""

    # Step 1: Download the PDF file from the URL
    response = requests.get(pdf_url)
    
    if response.status_code == 200:
        # Step 2: Read the content of the PDF from the response
        pdf_file = io.BytesIO(response.content)
        
        # Step 3: Open the PDF with PyPDF2
        reader = PyPDF2.PdfReader(pdf_file)
        
        # Step 4: Iterate through the pages and extract text
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            text += page.extract_text()
    
    else:
        print(f"Failed to download PDF. Status code: {response.status_code}")
    
    return text

# Function to identify due dates using Ollama 3
def get_due_dates_from_text(extracted_text):
    # Craft the question to ask Ollama 3
    question = f"Identify and return only the dates that their is a homework assignments due and the homework number: {extracted_text}"

    
    # Generate the response using the local Ollama model
    response = ollama.generate(model='llama3.2', prompt=question)
    
    # Return only the response part that lists the due dates
    return response["response"]

# Function to extract text from a PDF file object (already opened)
def extract_text_from_pdf_file(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    
    # Iterate through the pages and extract text
    for page_num in range(len(reader.pages)):
        page = reader.pages[page_num]
        text += page.extract_text()
    
    return text

@app.route('/data', methods=['POST'])
def parse_pdf():
    if 'syllabus' not in request.files:
        return {"error": "No file part"}, 400
    # Get the file from the request
    file = request.files['syllabus']
    if file.filename == '':
        return {"error": "No selected file"}, 400

    # Process the PDF file
    text = extract_text_from_pdf_file(file)
    
    #     # need json in this form
#     # date: new Date(det.grading.due),
#     #       event: `${classes[i].courseName} ${det.name}`,
#     #       source: "Blackboard",
#     #       completed: false,
#     #       id: det.id,

    return {"message": "File received", "text": text}

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)


# @app.route("/data")
# @cross_origin(origin="http://localhost:5173")
# def get_data():
#   data = {'message': 'Hello from Flask!'}
#   return jsonify(data)