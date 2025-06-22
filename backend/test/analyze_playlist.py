"""
Script to analyze video transcripts using Claude 4 Sonnet and identify segments based on a specific prompt.
Automatically fetches transcript from YouTube URL and analyzes it.
"""
import os
import json
import sys
import subprocess
from typing import List, Dict
import anthropic
from dotenv import load_dotenv

# Debug: Print current file location
print(f"Current file: {__file__}")
print(f"Current directory: {os.path.dirname(__file__)}")
print(f"Parent directory: {os.path.dirname(os.path.dirname(__file__))}")

# Load environment variables from .env file
load_dotenv()

# Debug: Print environment variables
print(f"ANTHROPIC_API_KEY exists: {bool(os.getenv('ANTHROPIC_API_KEY'))}")

def load_credentials():
    """Load credentials from environment variables."""
    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        raise Exception("Anthropic API key not found in environment variables")
    return {'ANTHROPIC_API_KEY': api_key}

def extract_video_id(url: str) -> str:
    """
    Extract the video ID from a YouTube URL.
    
    Args:
        url (str): The YouTube URL
        
    Returns:
        str: The video ID
    """
    import re
    # Match patterns like v=VIDEO_ID or /VIDEO_ID
    match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
    if match:
        return match.group(1)
    raise ValueError("Could not extract video ID from URL")

def fetch_transcript_from_youtube(youtube_url: str) -> str:
    """
    Fetch transcript from YouTube URL using transcript_fetch.py.
    
    Args:
        youtube_url (str): The YouTube URL
        
    Returns:
        str: Path to the generated transcript file
    """
    try:
        # Get the path to transcript_fetch.py
        transcript_fetch_path = os.path.join(os.path.dirname(__file__), 'transcript_fetch.py')
        
        print(f"Fetching transcript from: {youtube_url}")
        
        # Run transcript_fetch.py with the YouTube URL
        result = subprocess.run(
            [sys.executable, transcript_fetch_path, youtube_url],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Extract video ID to construct the transcript file path
        video_id = extract_video_id(youtube_url)
        transcript_path = os.path.join(os.path.dirname(__file__), 'temporary_files', f'transcript_{video_id}.txt')
        
        if os.path.exists(transcript_path):
            print(f"Transcript successfully fetched and saved to: {transcript_path}")
            return transcript_path
        else:
            raise FileNotFoundError(f"Transcript file not found at expected location: {transcript_path}")
            
    except subprocess.CalledProcessError as e:
        raise Exception(f"Error fetching transcript: {e.stderr}")
    except Exception as e:
        raise Exception(f"Error processing YouTube URL: {str(e)}")

def read_transcript(transcript_path: str) -> str:
    """
    Read transcript from the specified file path.
    
    Args:
        transcript_path (str): Path to the transcript file
        
    Returns:
        str: Content of the transcript file
    """
    if not os.path.exists(transcript_path):
        raise FileNotFoundError(f"Transcript file not found: {transcript_path}")
    
    with open(transcript_path, 'r', encoding='utf-8') as f:
        return f.read()

def analyze_transcript_with_prompt(transcript_content: str, user_prompt: str) -> List[Dict]:
    """
    Analyze transcript using Claude 4 Sonnet to identify segments relevant to the user's prompt.
    
    Args:
        transcript_content (str): Content of the transcript
        user_prompt (str): User's prompt describing what they're looking for
        
    Returns:
        List[Dict]: List of identified segments with start and end timestamps
    """
    prompt = f"""You are an assistant that analyzes video transcripts and finds segments relevant to a specific query.

Input transcript format:
Each segment has an index number, a start and end timestamp in "HH:MM:SS,mmm --> HH:MM:SS,mmm" format, followed by the spoken text.

User's query: {user_prompt}

Your task:
- Identify and extract segments or contiguous groups of segments that are relevant to the user's query.
- Return a JSON array of objects, each with:
  - "start": the start timestamp of the segment (string, format HH:MM:SS,mmm)
  - "end": the end timestamp of the segment (string, format HH:MM:SS,mmm)
  - "title": a brief description of what is discussed in this segment (string, maximum 4 words)
  - "summary": a brief summary of the segment (string, maximum 3 sentences, minimum 1 sentence)
  - "relevance_score": a score from 1-5 indicating how relevant this segment is to the query (integer)

IMPORTANT: 
- Your response must be a valid JSON array starting with [ and ending with ].
- Do not include any other text.
- Write titles that clearly describe the content of each segment.
- Keep titles concise and descriptive
- Sort segments by relevance_score in descending order (most relevant first)

Example response:
[
  {{
    "start": "00:00:00,160",
    "end": "00:00:35,200",
    "title": "Introduction to the main topic",
    "summary": "This segment introduces the main concept and sets up the foundation for the discussion.",
    "relevance_score": 5
  }},
  {{
    "start": "00:01:20,000",
    "end": "00:01:55,000",
    "title": "Detailed explanation of key concepts",
    "summary": "Provides a comprehensive explanation of the key concepts with examples and demonstrations.",
    "relevance_score": 4
  }}
]"""

    try:
        credentials = load_credentials()
        # Initialize Anthropic client
        client = anthropic.Anthropic(api_key=credentials.get('ANTHROPIC_API_KEY'))
        
        print(f"Analyzing transcript for query: '{user_prompt}'...")
        # Get response from Claude
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            messages=[
                {"role": "user", "content": f"Transcript text: {transcript_content}\n\nPrompt: {prompt}"}
            ]
        )

        # Parse JSON response
        try:
            content = response.content[0].text.replace('```json', '').replace('```', '').strip()
            
            # Clean up the response string
            if not content.startswith('['):
                content = '[' + content
            if not content.endswith(']'):
                content = content + ']'
                
            return json.loads(content)
            
        except json.JSONDecodeError as e:
            print(f"Error parsing response: {str(e)}")
            return []
            
    except Exception as e:
        print(f"Error: {str(e)}")
        raise Exception(f"Error analyzing transcript: {str(e)}")

def save_segments(segments: List[Dict], youtube_url: str, user_prompt: str) -> str:
    """
    Save identified segments to a JSON file.
    
    Args:
        segments (List[Dict]): List of identified segments
        youtube_url (str): The original YouTube URL
        user_prompt (str): The user's original query
        
    Returns:
        str: Path to the saved segments file
    """
    # Create segments filename based on video ID and prompt
    video_id = extract_video_id(youtube_url)
    # Create a safe filename from the prompt (first 20 chars, alphanumeric only)
    prompt_safe = ''.join(c for c in user_prompt[:20] if c.isalnum() or c in (' ', '-', '_')).replace(' ', '_')
    segments_file = f"transcript_{video_id}_{prompt_safe}_segments.json"
    segments_path = os.path.join(os.path.dirname(__file__), 'temporary_files', segments_file)
    
    # Save segments to file with metadata
    output_data = {
        "youtube_url": youtube_url,
        "video_id": video_id,
        "query": user_prompt,
        "segments": segments,
        "total_segments": len(segments)
    }
    
    with open(segments_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
    
    return segments_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python decide_clip.py <youtube_url> <prompt>")
        print("Example: python decide_clip.py 'https://www.youtube.com/watch?v=rfG8ce4nNh0' 'Find segments about mathematical intuition'")
        sys.exit(1)
    
    youtube_url = sys.argv[1]
    user_prompt = sys.argv[2]
    
    try:
        # Fetch transcript from YouTube URL
        transcript_path = fetch_transcript_from_youtube(youtube_url)
        
        # Read transcript
        transcript_content = read_transcript(transcript_path)
        
        # Analyze transcript with user's prompt
        segments = analyze_transcript_with_prompt(transcript_content, user_prompt)
        
        # Save segments
        segments_path = save_segments(segments, youtube_url, user_prompt)
        
        print(f"Found {len(segments)} relevant segments")
        print(f"Segments saved to: {segments_path}")
        
        # Print summary of found segments
        if segments:
            print("\nFound segments:")
            for i, segment in enumerate(segments, 1):
                print(f"{i}. {segment['title']} ({segment['start']} - {segment['end']}) [Relevance: {segment['relevance_score']}/5]")
                print(f"   Summary: {segment['summary']}")
                print()
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1) 

# EXAMPLE USE ----------------------------------------------------------------
python analyze_playlist.py "https://www.youtube.com/playlist?list=PLbUZQMMLnhfUXYPfDOZQ4dyydZO1zHNZh" "area under curve rotating about y-axis"
