from flask import Flask, jsonify, request
from flask_cors import CORS
import PyPDF2
import ollama  # Using the downloaded Ollama 3 model locally
from datetime import datetime

app = Flask(__name__)

# Allow CORS for requests from 'http://localhost:5173'
CORS(app, resources={r"/data": {"origins": "http://localhost:5173"}})

import requests
import io
import PyPDF2

# Your sample JSON data
# Your sample JSON data with ISO 8601 date format
sample_data = [
    {
        "date": "2024-10-23T10:30:00.000Z",
        "event": "CS101 Assignment 1",
        "source": "Other",
        "completed": False,
        "id": "A1-001"
    },
    {
        "date": "2024-10-25T10:30:00.000Z",
        "event": "MATH241 Quiz 3",
        "source": "Other",
        "completed": False,
        "id": "Q3-201"
    },
    {
        "date": "2024-10-27T10:30:00.000Z",
        "event": "HIST331 Midterm Exam",
        "source": "Other",
        "completed": False,
        "id": "EXAM-101"
    },
    {
        "date": "2024-10-30T10:30:00.000Z",
        "event": "CS101 Project Milestone",
        "source": "Other",
        "completed": True,
        "id": "PM-001"
    },
    {
        "date": "2024-11-01T10:30:00.000Z",
        "event": "ENG202 Essay Draft",
        "source": "Other",
        "completed": False,
        "id": "ESSAY-202"
    },
    {
        "date": "2024-11-03T10:30:00.000Z",
        "event": "BIO150 Lab Report",
        "source": "Other",
        "completed": True,
        "id": "LR-150"
    },
    {
        "date": "2024-11-05T10:30:00.000Z",
        "event": "CHEM101 Final Project",
        "source": "Other",
        "completed": False,
        "id": "FP-101"
    },
    {
        "date": "2024-11-07T10:30:00.000Z",
        "event": "CS101 Final Exam",
        "source": "Other",
        "completed": False,
        "id": "EXAM-101-FINAL"
    },
    {
        "date": "2024-11-10T10:30:00.000Z",
        "event": "PSY102 Research Paper",
        "source": "Other",
        "completed": False,
        "id": "RP-102"
    },
    {
        "date": "2024-11-12T10:30:00.000Z",
        "event": "MATH241 Homework 6",
        "source": "Other",
        "completed": True,
        "id": "HW6-241"
    }
]

sample_data_short = [
    {
        "date": "11/16/2024",
        "event": "CS101 Assignment 1",
        "source": "Other",
        "completed": False,
        "id": "CS101 Assignment 1"
    },
    # {
    #     "date": "11/13/2024",
    #     "event": "CS101 Project Milestone",
    #     "source": "Other",
    #     "completed": True,
    #     "id": "CS101 Project Milestone"
    # },
    {
        "date": "11/18/2024",
        "event": "CS101 Final Exam",
        "source": "Other",
        "completed": False,
        "id": "CS101 Final Exam"
    },
]

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
    print("MOOOOO: parse pdf called")
    if 'syllabus' not in request.files:
        return {"error": "No file part"}, 400
    # Get the file from the request
    file = request.files['syllabus']
    if file.filename == '':
        return {"error": "No selected file"}, 400

    # Process the PDF file
    text = extract_text_from_pdf_file(file)
    
    # need json in this form
    # date: new Date(det.grading.due),
    #       event: `${classes[i].courseName} ${det.name}`,
    #       source: "Blackboard",
    #       completed: false,
    #       id: det.id,

    # return {"message": "File received", "text": text)}
    return jsonify(sample_data_short)

if __name__ == '__main__':
    app.run(host='localhost', port=5000, debug=True)


# @app.route("/data")
# @cross_origin(origin="http://localhost:5173")
# def get_data():
#   data = {'message': 'Hello from Flask!'}
#   return jsonify(data)