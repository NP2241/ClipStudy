"""
Script to analyze video transcripts using GPT-4 and identify segments based on a specific prompt.
"""
import os
import json
import sys
from typing import List, Dict
from openai import OpenAI
from dotenv import load_dotenv

# Debug: Print current file location
print(f"Current file: {__file__}")
print(f"Current directory: {os.path.dirname(__file__)}")
print(f"Parent directory: {os.path.dirname(os.path.dirname(__file__))}")

# Construct and verify .env path
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'secrets', '.env')
print(f"Looking for .env file at: {env_path}")
print(f"File exists: {os.path.exists(env_path)}")

# Load environment variables from .env file
load_dotenv(env_path)

# Debug: Print environment variables
print(f"OPENAI_API_KEY exists: {bool(os.getenv('OPENAI_API_KEY'))}")

def load_credentials():
    """Load credentials from environment variables."""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise Exception("OpenAI API key not found in environment variables")
    return {'OPENAI_API_KEY': api_key}

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
    Analyze transcript using GPT-4 to identify segments relevant to the user's prompt.
    
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
- Each extracted segment MUST be:
  - At least 10 seconds long
  - Never longer than 2 minutes (2:00)
  - Ideally between 15-60 seconds for good context
- Return a JSON array of objects, each with:
  - "start": the start timestamp of the segment (string, format HH:MM:SS,mmm)
  - "end": the end timestamp of the segment (string, format HH:MM:SS,mmm)
  - "title": a brief description of what is discussed in this segment (string, maximum 10 words)
  - "relevance_score": a score from 1-10 indicating how relevant this segment is to the query (integer)

IMPORTANT: 
- Your response must be a valid JSON array starting with [ and ending with ].
- Do not include any other text.
- Write titles that clearly describe the content of each segment.
- Ensure each segment is at least 10 seconds and never exceeds 2:00 in length
- Keep titles concise and descriptive
- Sort segments by relevance_score in descending order (most relevant first)

Example response:
[
  {{
    "start": "00:00:00,160",
    "end": "00:00:35,200",
    "title": "Introduction to the main topic",
    "relevance_score": 9
  }},
  {{
    "start": "00:01:20,000",
    "end": "00:01:55,000",
    "title": "Detailed explanation of key concepts",
    "relevance_score": 8
  }}
]"""

    try:
        credentials = load_credentials()
        # Initialize OpenAI client
        client = OpenAI(api_key=credentials.get('OPENAI_API_KEY'))
        model = os.getenv('OPENAI_MODEL', 'gpt-4.1-mini-2025-04-14')
        
        print(f"Analyzing transcript for query: '{user_prompt}'...")
        # Get response from OpenAI
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that analyzes video transcripts to find segments relevant to specific queries. You must respond with only a valid JSON array. Each segment must be at least 10 seconds and never longer than 2:00. Sort by relevance score."},
                {"role": "user", "content": f"Transcript text: {transcript_content}\n\nPrompt: {prompt}"}
            ]
        )

        # Parse JSON response
        try:
            content = response.choices[0].message.content.replace('```json', '').replace('```', '').strip()
            
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

def save_segments(segments: List[Dict], transcript_path: str, user_prompt: str) -> str:
    """
    Save identified segments to a JSON file.
    
    Args:
        segments (List[Dict]): List of identified segments
        transcript_path (str): Path to the original transcript file
        user_prompt (str): The user's original query
        
    Returns:
        str: Path to the saved segments file
    """
    # Create segments filename based on transcript name and prompt
    base_name = os.path.splitext(os.path.basename(transcript_path))[0]
    # Create a safe filename from the prompt (first 20 chars, alphanumeric only)
    prompt_safe = ''.join(c for c in user_prompt[:20] if c.isalnum() or c in (' ', '-', '_')).replace(' ', '_')
    segments_file = f"{base_name}_{prompt_safe}_segments.json"
    segments_path = os.path.join(os.path.dirname(__file__), 'temporary_files', segments_file)
    
    # Save segments to file with metadata
    output_data = {
        "query": user_prompt,
        "transcript_source": transcript_path,
        "segments": segments,
        "total_segments": len(segments)
    }
    
    with open(segments_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
    
    return segments_path

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python decide_clip.py <transcript_file_path> <prompt>")
        print("Example: python decide_clip.py temporary_files/transcript_rfG8ce4nNh0.txt 'Find segments about mathematical intuition'")
        sys.exit(1)
    
    transcript_path = sys.argv[1]
    user_prompt = sys.argv[2]
    
    try:
        # Read transcript
        transcript_content = read_transcript(transcript_path)
        
        # Analyze transcript with user's prompt
        segments = analyze_transcript_with_prompt(transcript_content, user_prompt)
        
        # Save segments
        segments_path = save_segments(segments, transcript_path, user_prompt)
        
        print(f"Found {len(segments)} relevant segments")
        print(f"Segments saved to: {segments_path}")
        
        # Print summary of found segments
        if segments:
            print("\nFound segments:")
            for i, segment in enumerate(segments, 1):
                print(f"{i}. {segment['title']} ({segment['start']} - {segment['end']}) [Relevance: {segment['relevance_score']}/10]")
        
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1) 