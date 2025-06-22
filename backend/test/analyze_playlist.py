"""
Script to analyze video transcripts from YouTube playlists using Claude 4 Sonnet and identify segments based on a specific prompt.
Automatically fetches transcripts from all videos in a YouTube playlist and analyzes them.
"""
import os
import json
import sys
import subprocess
from typing import List, Dict
import anthropic
from dotenv import load_dotenv
import yt_dlp

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

def extract_playlist_videos(playlist_url: str) -> Dict[str, str]:
    """
    Extract video URLs from a YouTube playlist.
    
    Args:
        playlist_url (str): The YouTube playlist URL
        
    Returns:
        Dict[str, str]: Dictionary with video IDs as keys and full URLs as values
    """
    print(f"Fetching videos from playlist: {playlist_url}")
    
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'playlist_items': '1-100',  # Limit to first 100 videos
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            playlist_info = ydl.extract_info(playlist_url, download=False)
            
            if not playlist_info or 'entries' not in playlist_info:
                raise Exception("Could not extract playlist information")
            
            videos = {}
            for entry in playlist_info['entries']:
                if entry and 'id' in entry and 'url' in entry:
                    video_id = entry['id']
                    video_url = entry['url']
                    videos[video_id] = video_url
                    print(f"Found video: {video_id} - {entry.get('title', 'Unknown title')}")
            
            print(f"Total videos found in playlist: {len(videos)}")
            return videos
            
    except Exception as e:
        print(f"Error extracting playlist videos: {str(e)}")
        raise Exception(f"Failed to extract videos from playlist: {str(e)}")

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
    Fetch transcript from YouTube URL using transcript_fetch.py script.
    
    Args:
        youtube_url (str): The YouTube URL
        
    Returns:
        str: Path to the saved transcript file
    """
    # Get the path to transcript_fetch.py
    current_dir = os.path.dirname(__file__)
    transcript_fetch_path = os.path.join(current_dir, '..', 'transcript_extraction', 'transcript_fetch.py')
    
    if not os.path.exists(transcript_fetch_path):
        raise FileNotFoundError(f"transcript_fetch.py not found at: {transcript_fetch_path}")
    
    print(f"Fetching transcript from: {youtube_url}")
    
    # Run transcript_fetch.py with the YouTube URL
    result = subprocess.run(
        [sys.executable, transcript_fetch_path, youtube_url],
        capture_output=True,
        text=True,
        check=True
    )
    
    # Extract video ID from URL
    video_id = extract_video_id(youtube_url)
    
    # Construct the expected transcript file path
    transcript_path = os.path.join(current_dir, '..', 'transcript_extraction', 'temporary_files', f'transcript_{video_id}.txt')
    
    if not os.path.exists(transcript_path):
        raise FileNotFoundError(f"Transcript file not found at: {transcript_path}")
    
    print(f"Transcript successfully fetched and saved to: {transcript_path}")
    return transcript_path

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

def save_segments(segments: List[Dict], video_url: str, user_prompt: str) -> str:
    """
    Save segments to a JSON file.
    
    Args:
        segments (List[Dict]): List of segments to save
        video_url (str): The video URL
        user_prompt (str): The user's prompt
        
    Returns:
        str: Path to the saved segments file
    """
    video_id = extract_video_id(video_url)
    prompt_slug = user_prompt.replace(' ', '_').lower()
    
    # Create filename
    filename = f"transcript_{video_id}_{prompt_slug}_segments.json"
    
    # Save to temporary_files directory
    current_dir = os.path.dirname(__file__)
    segments_path = os.path.join(current_dir, '..', 'transcript_extraction', 'temporary_files', filename)
    
    with open(segments_path, 'w', encoding='utf-8') as f:
        json.dump(segments, f, indent=2)
    
    return segments_path

def analyze_playlist_with_prompt(playlist_url: str, user_prompt: str) -> Dict[str, Dict]:
    """
    Analyze all videos in a YouTube playlist for metadata relevance to the user's prompt.
    For each video, use preliminary_scan to determine if the prompt is likely relevant.
    Save the results as a JSON file in transcript_extraction/temporary_files/playlist_analysis.json.
    
    Args:
        playlist_url (str): The YouTube playlist URL
        user_prompt (str): User's prompt describing what they're looking for
        
    Returns:
        Dict[str, Dict]: Dictionary with video IDs as keys and scan results as values
    """
    print(f"Analyzing playlist: {playlist_url}")
    print(f"Search query: {user_prompt}")
    
    # Extract all video URLs from the playlist
    videos = extract_playlist_videos(playlist_url)
    
    if not videos:
        print("No videos found in playlist")
        return {}
    
    playlist_results = {}
    
    for video_id, video_url in videos.items():
        try:
            print(f"\n--- Scanning video {video_id} ---")
            scan_result = preliminary_scan(video_url, user_prompt)
            
            # Find the most relevant chapter timestamp if chapters exist
            timestamp = None
            if scan_result.get('chapters') and scan_result.get('relevance_analysis', {}).get('relevant_elements'):
                relevant_elements = scan_result.get('relevance_analysis', {}).get('relevant_elements', [])
                if 'chapters' in relevant_elements:
                    # Find the chapter with the highest relevance to the prompt
                    chapters = scan_result.get('chapters', [])
                    best_chapter = None
                    best_score = 0
                    
                    for chapter in chapters:
                        chapter_title = chapter.get('title', '').lower()
                        prompt_words = user_prompt.lower().split()
                        # Simple relevance scoring based on word overlap
                        score = sum(1 for word in prompt_words if word in chapter_title)
                        if score > best_score:
                            best_score = score
                            best_chapter = chapter
                    
                    if best_chapter:
                        timestamp = best_chapter.get('start_time', 0)
            
            playlist_results[video_id] = {
                'video_url': video_url,
                'title': scan_result.get('title', ''),
                'relevant': scan_result.get('is_likely_relevant', False),
                'relevance_score': scan_result.get('relevance_score', 0),
                'explanation': scan_result.get('relevance_analysis', {}).get('explanation', ''),
                'relevant_elements': scan_result.get('relevance_analysis', {}).get('relevant_elements', []),
                'confidence': scan_result.get('relevance_analysis', {}).get('confidence', ''),
                'timestamp': timestamp
            }
            print(f"Relevant: {playlist_results[video_id]['relevant']} | Score: {playlist_results[video_id]['relevance_score']}")
            if timestamp:
                print(f"Relevant chapter timestamp: {timestamp} seconds")
        except Exception as e:
            print(f"Error scanning video {video_id}: {str(e)}")
            playlist_results[video_id] = {
                'video_url': video_url,
                'title': '',
                'relevant': False,
                'relevance_score': 0,
                'explanation': f'Error: {str(e)}',
                'relevant_elements': [],
                'confidence': 'low',
                'timestamp': None
            }
    
    # Sort results by relevance score in descending order
    sorted_results = dict(sorted(playlist_results.items(), 
                                key=lambda x: x[1]['relevance_score'], 
                                reverse=True))
    
    # Save results to JSON file
    current_dir = os.path.dirname(__file__)
    output_path = os.path.join(current_dir, '..', 'transcript_extraction', 'temporary_files', 'playlist_analysis.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(sorted_results, f, indent=2)
    print(f"\nPlaylist analysis saved to: {output_path}")
    return sorted_results

def preliminary_scan(video_url: str, user_prompt: str) -> Dict:
    """
    Perform a preliminary scan of a YouTube video to determine if the prompt is likely to be found.
    Extracts video title, chapters, and description, then analyzes relevance.
    
    Args:
        video_url (str): The YouTube video URL
        user_prompt (str): User's prompt to check relevance against
        
    Returns:
        Dict: Contains video metadata and relevance analysis
    """
    print(f"Performing preliminary scan for: {video_url}")
    
    ydl_opts = {
        'quiet': True,
        'extract_flat': False,  # Need full info for chapters and description
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            video_info = ydl.extract_info(video_url, download=False)
            
            if not video_info:
                raise Exception("Could not extract video information")
            
            # Extract basic metadata
            video_id = video_info.get('id', '')
            title = video_info.get('title', '')
            description = video_info.get('description', '')
            
            # Extract chapters if available
            chapters = []
            if 'chapters' in video_info and video_info['chapters']:
                for chapter in video_info['chapters']:
                    chapters.append({
                        'title': chapter.get('title', ''),
                        'start_time': chapter.get('start_time', 0),
                        'end_time': chapter.get('end_time', 0)
                    })
            
            # Prepare content for analysis
            content_for_analysis = f"Video Title: {title}\n\n"
            
            if chapters:
                content_for_analysis += "Video Chapters:\n"
                for i, chapter in enumerate(chapters, 1):
                    content_for_analysis += f"{i}. {chapter['title']}\n"
                content_for_analysis += "\n"
            
            if description:
                # Truncate description if too long (keep first 1000 characters)
                truncated_description = description[:1000] + "..." if len(description) > 1000 else description
                content_for_analysis += f"Video Description:\n{truncated_description}\n\n"
            
            # Analyze relevance using Claude
            relevance_analysis = analyze_content_relevance(content_for_analysis, user_prompt)
            
            # Calculate overall relevance score
            relevance_score = relevance_analysis.get('relevance_score', 0)
            is_likely_relevant = relevance_score >= 3  # Threshold for likely relevance
            
            result = {
                'video_id': video_id,
                'video_url': video_url,
                'title': title,
                'chapters': chapters,
                'description': description,
                'relevance_analysis': relevance_analysis,
                'relevance_score': relevance_score,
                'is_likely_relevant': is_likely_relevant,
                'content_summary': content_for_analysis
            }
            
            print(f"Preliminary scan complete for {video_id}")
            print(f"Title: {title}")
            print(f"Chapters found: {len(chapters)}")
            print(f"Relevance score: {relevance_score}/5")
            print(f"Likely relevant: {is_likely_relevant}")
            
            return result
            
    except Exception as e:
        print(f"Error in preliminary scan: {str(e)}")
        return {
            'video_url': video_url,
            'error': str(e),
            'relevance_score': 0,
            'is_likely_relevant': False
        }

def analyze_content_relevance(content: str, user_prompt: str) -> Dict:
    """
    Analyze the relevance of video metadata content to the user's prompt using Claude.
    
    Args:
        content (str): Video metadata content (title, chapters, description)
        user_prompt (str): User's prompt to check relevance against
        
    Returns:
        Dict: Relevance analysis results
    """
    prompt = f"""You are an assistant that analyzes video metadata to determine if a video is likely to contain content relevant to a user's query.

Video Metadata:
{content}

User's Query: {user_prompt}

Your task:
- Analyze the video title, chapters, and description
- Determine if the video is likely to contain content relevant to the user's query
- Provide a relevance score from 1-5 where:
  1 = Very unlikely to contain relevant content
  2 = Unlikely to contain relevant content
  3 = Possibly contains relevant content
  4 = Likely contains relevant content
  5 = Very likely to contain relevant content

- Provide a brief explanation of your reasoning
- Identify which specific elements (title, chapters, description) suggest relevance

Return your response as a JSON object with:
- "relevance_score": integer from 1-5
- "explanation": string explaining your reasoning
- "relevant_elements": list of strings identifying which metadata elements suggest relevance
- "confidence": string indicating your confidence level (low/medium/high)

Example response:
{{
  "relevance_score": 4,
  "explanation": "The video title mentions 'calculus' and several chapters discuss 'integration' and 'area under curves', which directly relate to the user's query about mathematical concepts.",
  "relevant_elements": ["title", "chapters"],
  "confidence": "high"
}}"""

    try:
        credentials = load_credentials()
        client = anthropic.Anthropic(api_key=credentials.get('ANTHROPIC_API_KEY'))
        
        response = client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        # Parse JSON response
        try:
            content = response.content[0].text.replace('```json', '').replace('```', '').strip()
            return json.loads(content)
            
        except json.JSONDecodeError as e:
            print(f"Error parsing relevance analysis response: {str(e)}")
            return {
                'relevance_score': 0,
                'explanation': 'Error parsing analysis response',
                'relevant_elements': [],
                'confidence': 'low'
            }
            
    except Exception as e:
        print(f"Error in content relevance analysis: {str(e)}")
        return {
            'relevance_score': 0,
            'explanation': f'Error during analysis: {str(e)}',
            'relevant_elements': [],
            'confidence': 'low'
        }

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python analyze_playlist.py <youtube_playlist_url> <prompt>")
        print("Example: python analyze_playlist.py 'https://www.youtube.com/playlist?list=PLbUZQMMLnhfUXYPfDOZQ4dyydZO1zHNZh' 'Find segments about mathematical intuition'")
        sys.exit(1)
    
    playlist_url = sys.argv[1]
    user_prompt = sys.argv[2]
    
    try:
        # Analyze playlist with user's prompt
        playlist_results = analyze_playlist_with_prompt(playlist_url, user_prompt)
        
        # Print summary
        total_videos = len(playlist_results)
        relevant_videos = sum(1 for result in playlist_results.values() if result['relevant'])
        print(f"\n=== PLAYLIST ANALYSIS SUMMARY ===")
        print(f"Total videos analyzed: {total_videos}")
        print(f"Videos likely relevant: {relevant_videos}")
        for video_id, result in playlist_results.items():
            print(f"\nVideo {video_id}:")
            print(f"  URL: {result['video_url']}")
            print(f"  Title: {result['title']}")
            print(f"  Relevant: {result['relevant']} | Score: {result['relevance_score']}")
            print(f"  Explanation: {result['explanation']}")
            print(f"  Relevant Elements: {result['relevant_elements']}")
            print(f"  Confidence: {result['confidence']}")
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1)

# EXAMPLE USE ----------------------------------------------------------------
# python analyze_playlist.py "https://www.youtube.com/playlist?list=PLbUZQMMLnhfUXYPfDOZQ4dyydZO1zHNZh" "area under curve rotating about y-axis"
