from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sys
import subprocess
import json
from urllib.parse import unquote

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

def construct_youtube_url(video_id: str) -> str:
    """
    Construct a YouTube URL from a video ID.
    
    Args:
        video_id (str): The YouTube video ID
        
    Returns:
        str: The complete YouTube URL
    """
    return f"https://www.youtube.com/watch?v={video_id}"

@app.route("/api/hello")
def hello():
    return jsonify({"message": "Hello from Flask!"})

@app.route("/api/get/<video_id>")
def get_segments(video_id):
    """
    Get relevant segments from a YouTube video based on a prompt.
    
    Args:
        video_id (str): YouTube video ID
        prompt (str): Search prompt for finding relevant segments (query parameter)
        
    Returns:
        JSON response with segments and metadata
    """
    try:
        print(f"[DEBUG] Received request for video_id: {video_id}")
        prompt = request.args.get('prompt')
        if not prompt:
            print("[DEBUG] Missing prompt query parameter")
            return jsonify({
                "error": "Missing 'prompt' query parameter",
                "usage": "Use /api/get/{video_id}?prompt=your search query"
            }), 400
        print(f"[DEBUG] Prompt: {prompt}")
        youtube_url = construct_youtube_url(video_id)
        print(f"[DEBUG] Constructed YouTube URL: {youtube_url}")
        decide_clip_path = os.path.join(os.path.dirname(__file__), 'transcript_extraction', 'decide_clip.py')
        print(f"[DEBUG] Path to decide_clip.py: {decide_clip_path}")
        command = [sys.executable, decide_clip_path, youtube_url, prompt]
        print(f"[DEBUG] Running command: {' '.join(command)}")
        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            cwd=os.path.dirname(__file__)
        )
        print(f"[DEBUG] Subprocess return code: {result.returncode}")
        print(f"[DEBUG] Subprocess stdout: {result.stdout}")
        print(f"[DEBUG] Subprocess stderr: {result.stderr}")
        if result.returncode != 0:
            return jsonify({
                "error": "Failed to process video",
                "details": result.stderr,
                "stdout": result.stdout
            }), 500
        segments_dir = os.path.join(os.path.dirname(__file__), 'transcript_extraction', 'temporary_files')
        prompt_safe = ''.join(c for c in prompt[:20] if c.isalnum() or c in (' ', '-', '_')).replace(' ', '_')
        segments_file = f"transcript_{video_id}_{prompt_safe}_segments.json"
        segments_path = os.path.join(segments_dir, segments_file)
        print(f"[DEBUG] Looking for segments file at: {segments_path}")
        if not os.path.exists(segments_path):
            print("[DEBUG] Segments file not found!")
            return jsonify({
                "error": "Segments file not found",
                "expected_path": segments_path
            }), 404
        with open(segments_path, 'r', encoding='utf-8') as f:
            segments_data = json.load(f)
        print(f"[DEBUG] Successfully loaded segments data")
        return jsonify(segments_data)
    except Exception as e:
        print(f"[DEBUG] Exception occurred: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

@app.route("/api/info/<video_id>")
def get_video_info(video_id):
    """
    Get basic information about a YouTube video.
    
    Args:
        video_id (str): YouTube video ID
        
    Returns:
        JSON response with video information
    """
    try:
        youtube_url = construct_youtube_url(video_id)
        transcript_path = os.path.join(
            os.path.dirname(__file__), 
            'transcript_extraction', 
            'temporary_files', 
            f'transcript_{video_id}.txt'
        )
        if os.path.exists(transcript_path):
            return jsonify({
                "video_id": video_id,
                "youtube_url": youtube_url,
                "transcript_available": True,
                "transcript_path": transcript_path
            })
        else:
            return jsonify({
                "video_id": video_id,
                "youtube_url": youtube_url,
                "transcript_available": False,
                "message": "Transcript not found. Use /api/get/{video_id}?prompt=your query to fetch and analyze."
            })
    except Exception as e:
        print(f"[DEBUG] Exception occurred: {str(e)}")
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500

if __name__ == "__main__":
    app.run(debug=True)