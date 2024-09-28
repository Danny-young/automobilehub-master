from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import speech_recognition as sr
import os
import tempfile
import queue
import threading

app = Flask(__name__)
CORS(app)

recognizer = sr.Recognizer()

def recognize_stream(audio_file_path, result_queue):
    with sr.AudioFile(audio_file_path) as source:
        audio = recognizer.record(source)
    
    try:
        for phrase in recognizer.recognize_google(audio, show_all=False, with_confidence=True):
            result_queue.put(phrase)
    except sr.UnknownValueError:
        result_queue.put(None)
    except sr.RequestError as e:
        result_queue.put(f"Error: {str(e)}")

@app.route('/speech-to-text', methods=['POST'])
def speech_to_text():
    print("Received request from:", request.remote_addr)
    print("Request headers:", request.headers)
    if 'audio' not in request.files:
        print("No audio file in request")
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files['audio']
    print(f"Received audio file: {audio_file.filename}")
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.wav') as temp_audio:
        audio_file.save(temp_audio.name)
        temp_audio_path = temp_audio.name
    print(f"Saved audio file to: {temp_audio_path}")

    try:
        with sr.AudioFile(temp_audio_path) as source:
            audio = recognizer.record(source)
        
        text = recognizer.recognize_google(audio)
        print(f"Recognized text: {text}")
        return jsonify({"text": text})
    except sr.UnknownValueError:
        print("Could not understand audio")
        return jsonify({"error": "Could not understand audio"}), 400
    except sr.RequestError as e:
        print(f"Could not request results from Google Speech Recognition service; {e}")
        return jsonify({"error": f"Error with the speech recognition service: {str(e)}"}), 500
    finally:
        os.unlink(temp_audio_path)
        print("Finished processing audio")

if __name__ == '__main__':
    print(f"Starting server on http://0.0.0.0:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)