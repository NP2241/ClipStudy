"""
Transcript fetching module for handling video transcript extraction and processing.
Local script that downloads YouTube video transcripts.
"""
import subprocess
import os
import sys
import re
from typing import Optional, List, Dict

def extract_video_id(url: str) -> str:
    """
    Extract the video ID from a YouTube URL.
    
    Args:
        url (str): The YouTube URL
        
    Returns:
        str: The video ID
    """
    # Match patterns like v=VIDEO_ID or /VIDEO_ID
    match = re.search(r'(?:v=|\/)([0-9A-Za-z_-]{11}).*', url)
    if match:
        return match.group(1)
    raise ValueError("Could not extract video ID from URL")

def parse_srt(srt_text: str) -> List[Dict]:
    """
    Parse SRT text into a list of subtitle dictionaries.
    
    Args:
        srt_text (str): The SRT file content
        
    Returns:
        List[Dict]: List of subtitle dictionaries with index, start, end, and text
    """
    pattern = re.compile(r"(\d+)\s+(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})\s+([\s\S]*?)(?=\n\d+\n|\Z)", re.MULTILINE)
    subs = []
    for match in pattern.finditer(srt_text):
        idx, start, end, text = match.groups()
        text = " ".join(line.strip() for line in text.strip().splitlines())
        subs.append({"index": int(idx), "start": start, "end": end, "text": text})
    return subs

def time_to_millis(t: str) -> int:
    """
    Convert SRT timestamp to milliseconds.
    
    Args:
        t (str): Timestamp in format HH:MM:SS,mmm
        
    Returns:
        int: Time in milliseconds
    """
    h, m, s_ms = t.split(":")
    s, ms = s_ms.split(",")
    return (int(h)*3600 + int(m)*60 + int(s))*1000 + int(ms)

def millis_to_time(millis: int) -> str:
    """
    Convert milliseconds to SRT timestamp.
    
    Args:
        millis (int): Time in milliseconds
        
    Returns:
        str: Timestamp in format HH:MM:SS,mmm
    """
    ms = millis % 1000
    s = (millis // 1000) % 60
    m = (millis // (60*1000)) % 60
    h = millis // (3600*1000)
    return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

def remove_and_merge(subs: List[Dict]) -> List[Dict]:
    """
    Remove overlapping text and merge consecutive identical subtitles.
    
    Args:
        subs (List[Dict]): List of subtitle dictionaries
        
    Returns:
        List[Dict]: List of cleaned and merged subtitle dictionaries
    """
    cleaned = []
    prev_text = ""
    prev_start = None
    prev_end = None

    for sub in subs:
        # Remove prefix overlap with previous
        if sub["text"].startswith(prev_text):
            new_text = sub["text"][len(prev_text):].strip()
        else:
            new_text = sub["text"]

        if not new_text:
            # Skip empty subtitles
            continue

        # If current text equals previous text, merge times
        if cleaned and new_text == cleaned[-1]["text"]:
            # Extend end time
            cleaned[-1]["end"] = sub["end"]
        else:
            cleaned.append({
                "index": 0,  # will reindex later
                "start": sub["start"],
                "end": sub["end"],
                "text": new_text
            })

        prev_text = sub["text"]

    # Fix indexes
    for i, sub in enumerate(cleaned, 1):
        sub["index"] = i

    return cleaned

def format_srt(subs: List[Dict]) -> str:
    """
    Format subtitle dictionaries back into SRT format.
    
    Args:
        subs (List[Dict]): List of subtitle dictionaries
        
    Returns:
        str: Formatted SRT text
    """
    srt_blocks = []
    for sub in subs:
        block = f"{sub['index']}\n{sub['start']} --> {sub['end']}\n{sub['text']}\n"
        srt_blocks.append(block)
    return "\n".join(srt_blocks)

def clean_transcript(transcript_content: str) -> str:
    """
    Clean the transcript by removing duplicate text and merging identical consecutive subtitles.
    
    Args:
        transcript_content (str): The original transcript content
        
    Returns:
        str: The cleaned transcript content
    """
    subs = parse_srt(transcript_content)
    cleaned = []
    prev_text = ""
    for sub in subs:
        if sub["text"].startswith(prev_text):
            new_text = sub["text"][len(prev_text):].strip()
        else:
            new_text = sub["text"]
        if not new_text:
            continue
        if cleaned and new_text == cleaned[-1]["text"]:
            cleaned[-1]["end"] = sub["end"]
        else:
            cleaned.append({
                "index": 0,
                "start": sub["start"],
                "end": sub["end"],
                "text": new_text
            })
        prev_text = sub["text"]
    for i, sub in enumerate(cleaned, 1):
        sub["index"] = i
    srt_blocks = []
    for sub in cleaned:
        block = f"{sub['index']}\n{sub['start']} --> {sub['end']}\n{sub['text']}\n"
        srt_blocks.append(block)
    return "\n".join(srt_blocks)

def fetch_transcript(video_url: str, output_dir: Optional[str] = None) -> str:
    """
    Download English auto-generated captions from a YouTube video using yt-dlp.
    
    Args:
        video_url (str): The URL of the YouTube video
        output_dir (str, optional): Directory to save the transcript. Defaults to temporary_files.
    
    Returns:
        str: The transcript content
    """
    if output_dir is None:
        output_dir = os.path.join(os.path.dirname(__file__), 'temporary_files')
    
    # Ensure output directory exists
    os.makedirs(output_dir, exist_ok=True)
    
    # Extract video ID and create filenames
    video_id = extract_video_id(video_url)
    output_file = os.path.join(output_dir, f"transcript_{video_id}.txt")
    
    # Remove any existing .srt or .txt files for this video
    for f in os.listdir(output_dir):
        if f.startswith('transcript') and (f.endswith('.srt') or f.endswith('.txt')):
            os.remove(os.path.join(output_dir, f))
    
    try:
        # Construct the yt-dlp command
        command = [
            'yt-dlp',
            '--write-auto-subs',
            '--sub-lang', 'en',
            '--skip-download',
            '--convert-subs', 'srt',
            '--no-warnings',
            '-o', os.path.join(output_dir, 'transcript'),
            video_url
        ]
        
        # Run the command
        subprocess.run(command, check=True, capture_output=True, text=True)
        
        # Find any .srt file (including transcript.en.srt)
        srt_files = [f for f in os.listdir(output_dir) if f.startswith('transcript') and f.endswith('.srt')]
        if not srt_files:
            raise FileNotFoundError(f"No .srt transcript file found in {output_dir}")
        # Use the first .srt file found
        srt_path = os.path.join(output_dir, srt_files[0])
        with open(srt_path, 'r', encoding='utf-8') as f:
            transcript_content = f.read()
        
        # Clean the transcript
        cleaned_content = clean_transcript(transcript_content)
        
        # Save to transcript_{video_id}.txt
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(cleaned_content)
        
        # Remove all .srt files after processing
        for f in srt_files:
            os.remove(os.path.join(output_dir, f))
        
        return cleaned_content
    except subprocess.CalledProcessError as e:
        raise Exception(f"Failed to download transcript: {e.stderr}")
    except Exception as e:
        raise Exception(f"Error processing video: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python transcript_fetch.py <YouTube_URL>")
        sys.exit(1)
    
    video_url = sys.argv[1]
    try:
        video_id = extract_video_id(video_url)
        output_file = os.path.join(os.path.dirname(__file__), 'temporary_files', f"transcript_{video_id}.txt")
        
        # Check if file exists and inform user
        if os.path.exists(output_file):
            print(f"Overwriting existing transcript file: transcript_{video_id}.txt")
        
        fetch_transcript(video_url)
        print(f"Transcript saved to temporary_files/transcript_{video_id}.txt")
    except Exception as e:
        print(f"Error: {str(e)}")
        sys.exit(1) 