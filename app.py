# app.py – Flask Backend for ResumeAI

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from resume_generator import generate_resume_pdf
from ai_engine import enhance_resume_content

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'output')
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Serve frontend
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory(app.static_folder, path)

# API: Enhance resume content with AI
@app.route('/api/enhance', methods=['POST'])
def enhance():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    try:
        enhanced = enhance_resume_content(data)
        return jsonify({'success': True, 'data': enhanced})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# API: Generate PDF resume
@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    try:
        pdf_path = generate_resume_pdf(data, OUTPUT_DIR)
        filename = os.path.basename(pdf_path)
        return jsonify({'success': True, 'filename': filename, 'path': f'/api/download/{filename}'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# API: Download generated PDF
@app.route('/api/download/<filename>')
def download_file(filename):
    return send_from_directory(OUTPUT_DIR, filename, as_attachment=True)

# API: Save user data to DB
@app.route('/api/save', methods=['POST'])
def save_user_data():
    data = request.get_json()
    db_path = os.path.join(os.path.dirname(__file__), '..', 'database', 'user_data.json')
    os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Load existing
    if os.path.exists(db_path):
        with open(db_path, 'r') as f:
            db = json.load(f)
    else:
        db = {'users': []}

    db['users'].append(data)

    with open(db_path, 'w') as f:
        json.dump(db, f, indent=2)

    return jsonify({'success': True, 'message': 'Data saved'})

if __name__ == '__main__':
    print("🚀 ResumeAI backend running at http://localhost:5000")
    app.run(debug=True, port=5000)
