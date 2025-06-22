# SmartLLMs - Comprehensive Architecture Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [File Structure](#file-structure)
4. [Data Flow](#data-flow)
5. [API Endpoints](#api-endpoints)
6. [Core Components](#core-components)
7. [Dependencies](#dependencies)
8. [Configuration](#configuration)

## Project Overview

SmartLLMs is a Python-based web application that extracts, cleans, and analyzes YouTube video transcripts to find relevant segments based on user queries. The system uses Anthropic's Claude 4 Sonnet for intelligent transcript analysis and provides a REST API for easy integration.

### Key Features
- **YouTube Transcript Extraction**: Automatically downloads and cleans auto-generated YouTube subtitles
- **Intelligent Analysis**: Uses Claude 4 Sonnet to identify relevant video segments
- **REST API**: Flask-based API for easy integration with frontend applications
- **Transcript Cleaning**: Removes overlaps and merges incomplete sentences for better readability

## System Architecture

```
┌─────────────────┐    HTTP Request     ┌─────────────────┐
│   Frontend/     │ ──────────────────► │   Flask API     │
│   Client        │                     │   (app.py)      │
└─────────────────┘                     └─────────────────┘
                                                │
                                                ▼
┌─────────────────┐                     ┌─────────────────┐
│   YouTube       │ ◄────────────────── │  decide_clip.py │
│   (yt-dlp)      │                     │                 │
└─────────────────┘                     └─────────────────┘
                                                │
                                                ▼
┌─────────────────┐                     ┌─────────────────┐
│   Anthropic     │ ◄───────────────────│  Claude 4       │
│   Claude API    │                     │  Sonnet         │
└─────────────────┘                     └─────────────────┘
```

## File Structure

```
SmartLLMs/
├── backend/
│   ├── app.py                           # Flask web server and API endpoints
│   ├── __pycache__/                     # Python cache files
│   │   └── app.cpython-311.pyc
│   ├── .DS_Store                        # macOS system file
│   ├── .gitkeep                         # Git placeholder file
│   └── transcript_extraction/
│       ├── transcript_fetch.py          # YouTube transcript download and cleaning
│       ├── decide_clip.py               # Main analysis script using Claude
│       └── temporary_files/             # Storage for transcripts and segments
│           ├── transcript_rfG8ce4nNh0.txt
│           ├── transcript_rfG8ce4nNh0_Matrix_Multiplicatio_segments.json
│           └── transcript_AJxYCosjRH0_density_segments.json
├── frontend/                            # Next.js React frontend application
│   ├── src/
│   │   └── app/                         # Next.js App Router
│   │       ├── layout.tsx               # Root layout component
│   │       ├── page.tsx                 # Main page component
│   │       ├── globals.css              # Global styles
│   │       ├── favicon.ico              # Site favicon
│   │       ├── test/                    # Test pages and components
│   │       │   ├── page.tsx             # Test page with resizable panels
│   │       │   ├── 2/                   # Test subdirectory
│   │       │   └── 3/                   # Test subdirectory
│   │       │       └── page copy.tsx    # Chat interface test component
│   │       └── apit/                    # API route handlers
│   │           └── route.js             # Streaming API endpoint
│   ├── public/                          # Static assets
│   │   ├── next.svg                     # Next.js logo
│   │   ├── vercel.svg                   # Vercel logo
│   │   ├── window.svg                   # Window icon
│   │   ├── file.svg                     # File icon
│   │   └── globe.svg                    # Globe icon
│   ├── package.json                     # Frontend dependencies and scripts
│   ├── pnpm-lock.yaml                   # Package lock file (pnpm)
│   ├── next.config.ts                   # Next.js configuration
│   ├── tsconfig.json                    # TypeScript configuration
│   ├── postcss.config.mjs               # PostCSS configuration
│   ├── eslint.config.mjs                # ESLint configuration
│   ├── .gitignore                       # Frontend git ignore rules
│   └── README.md                        # Frontend documentation
├── tests/                               # Test files and data
│   └── data_science_test                # Data science test file
├── docs/                                # Documentation
│   ├── ARCHITECTURE.md                  # This comprehensive documentation
│   └── .gitkeep                         # Git placeholder file
├── decide_clip.py                       # Root-level OpenAI-based analysis script
├── .gitignore                           # Root git ignore rules
└── README.md                            # Project overview
```

## Data Flow

### 1. API Request Flow

```
1. Client Request
   └── GET /api/get/{video_id}?prompt={query}
       │
       ▼
2. Flask App (app.py)
   ├── construct_youtube_url()           # Build YouTube URL from video ID
   ├── get_segments()                    # Main endpoint handler
   └── Subprocess call to decide_clip.py
       │
       ▼
3. decide_clip.py
   ├── fetch_transcript_from_youtube()   # Call transcript_fetch.py
   ├── read_transcript()                 # Load transcript file
   ├── analyze_transcript_with_prompt()  # Claude API analysis
   └── save_segments()                   # Save results to JSON
       │
       ▼
4. Flask App (app.py)
   ├── Load segments JSON file
   ├── Load full transcript
   └── Return combined JSON response
```

### 2. Transcript Processing Flow

```
1. YouTube Video
   └── yt-dlp command
       ├── --write-auto-subs
       ├── --sub-lang en
       └── --convert-subs srt
       │
       ▼
2. Raw SRT File
   └── transcript_fetch.py
       ├── parse_srt()                   # Parse SRT format
       ├── remove_and_merge()            # Clean overlaps
       └── format_srt()                  # Remove index numbers
       │
       ▼
3. Cleaned Transcript
   └── transcript_{video_id}.txt
       │
       ▼
4. Claude Analysis
   └── analyze_transcript_with_prompt()
       ├── Load credentials
       ├── Initialize Anthropic client
       ├── Send prompt + transcript
       └── Parse JSON response
       │
       ▼
5. Segments JSON
   └── transcript_{video_id}_{prompt}_segments.json
```

## API Endpoints

### 1. `/api/hello`
- **Method**: GET
- **Purpose**: Health check endpoint
- **Response**: `{"message": "Hello from Flask!"}`

### 2. `/api/get/{video_id}`
- **Method**: GET
- **Parameters**: 
  - `video_id` (path): YouTube video ID
  - `prompt` (query): Search query for finding relevant segments
- **Purpose**: Main endpoint for transcript analysis
- **Response Structure**:
```json
{
  "video_id": "rfG8ce4nNh0",
  "youtube_url": "https://www.youtube.com/watch?v=rfG8ce4nNh0",
  "transcript": "00:00:12,079 --> 00:00:15,760\nThis guy, Grothendieck...",
  "segments": [
    {
      "start": "00:09:34,320",
      "end": "00:09:56,900",
      "title": "Area Function with Variable Bound",
      "summary": "Introduces the concept of treating the integral's right endpoint as a variable T...",
      "relevance_score": 5
    }
  ],
  "query": "Area Function with Variable Upper Bound",
  "total_segments": 4
}
```

### 3. `/api/info/{video_id}`
- **Method**: GET
- **Parameters**: `video_id` (path): YouTube video ID
- **Purpose**: Check if transcript exists for a video
- **Response**: Video information and transcript availability

## Core Components

### 1. Flask App (`backend/app.py`)

#### Key Functions:

**`construct_youtube_url(video_id: str) -> str`**
- Converts video ID to full YouTube URL
- Format: `https://www.youtube.com/watch?v={video_id}`

**`get_segments(video_id)`**
- Main API endpoint handler
- Orchestrates the entire analysis process
- Calls `decide_clip.py` via subprocess
- Returns combined response with transcript and segments

**`get_video_info(video_id)`**
- Checks transcript availability
- Returns basic video information

### 2. Transcript Fetch (`backend/transcript_extraction/transcript_fetch.py`)

#### Key Functions:

**`extract_video_id(url: str) -> str`**
- Extracts 11-character video ID from YouTube URL
- Supports multiple URL formats

**`parse_srt(srt_text: str) -> List[Dict]`**
- Parses SRT subtitle format into structured data
- Returns list of subtitle dictionaries with timestamps and text

**`remove_and_merge(subs: List[Dict]) -> List[Dict]`**
- Removes overlapping text between consecutive subtitles
- Merges incomplete sentences (e.g., "they are an" + "inverse of derivatives")
- Handles prefix overlaps and continuation patterns

**`clean_transcript(transcript_content: str) -> str`**
- Main cleaning function that orchestrates the cleaning process
- Calls `remove_and_merge()` and `format_srt()`

**`format_srt(subs: List[Dict]) -> str`**
- Formats cleaned subtitles back to text format
- Removes index numbers for cleaner output

**`fetch_transcript(video_url: str, output_dir: str, save_raw_transcript: bool) -> str`**
- Downloads YouTube auto-generated subtitles using yt-dlp
- Cleans and saves transcript to file
- Optionally saves raw transcript for comparison

### 3. Analysis Engine (`backend/transcript_extraction/decide_clip.py`)

#### Key Functions:

**`load_credentials() -> Dict`**
- Loads Anthropic API key from environment variables
- Validates API key presence

**`fetch_transcript_from_youtube(youtube_url: str) -> str`**
- Calls `transcript_fetch.py` via subprocess
- Returns path to generated transcript file

**`read_transcript(transcript_path: str) -> str`**
- Reads transcript content from file
- Handles file encoding and existence checks

**`analyze_transcript_with_prompt(transcript_content: str, user_prompt: str) -> List[Dict]`**
- Core analysis function using Claude 4 Sonnet
- Sends structured prompt to Claude API
- Parses JSON response into segment objects
- Returns list of relevant segments with metadata

**`save_segments(segments: List[Dict], youtube_url: str, user_prompt: str) -> str`**
- Saves analysis results to JSON file
- Creates safe filenames based on video ID and prompt
- Includes metadata in output file

### 4. Root-Level Analysis Script (`decide_clip.py`)

#### Key Functions:

**`load_credentials() -> Dict`**
- Loads OpenAI API key from environment variables
- Uses different environment path structure

**`analyze_transcript_with_prompt(transcript_content: str, user_prompt: str) -> List[Dict]`**
- Uses OpenAI GPT-4 for analysis instead of Claude
- Different prompt structure and response format
- Includes segment length constraints (10 seconds minimum, 2 minutes maximum)

**`save_segments(segments: List[Dict], transcript_path: str, user_prompt: str) -> str`**
- Saves to different location structure
- Uses transcript filename as base for segments file

### 5. Frontend Components

#### Key Files:

**`frontend/src/app/page.tsx`**
- Main application page
- User interface for video analysis

**`frontend/src/app/layout.tsx`**
- Root layout component
- Global styling and structure

**`frontend/src/app/test/page.tsx`**
- Test page with resizable panels
- Uses Radix UI and React Resizable Panels

**`frontend/src/app/test/3/page copy.tsx`**
- Chat interface test component
- Demonstrates message display and layout

**`frontend/src/app/apit/route.js`**
- Streaming API endpoint
- Demonstrates server-side streaming functionality

## Dependencies

### Backend Python Packages
- **Flask**: Web framework for API
- **Flask-CORS**: Cross-origin resource sharing
- **anthropic**: Anthropic Claude API client
- **openai**: OpenAI API client (for root-level script)
- **python-dotenv**: Environment variable management
- **yt-dlp**: YouTube video downloader (external tool)

### Frontend Technologies
- **Next.js**: React framework for production
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible React component library
- **React Resizable Panels**: Resizable panel components
- **pnpm**: Package manager (alternative to npm)

### Standard Library (Python)
- **os**: File system operations
- **sys**: System parameters and subprocess execution
- **subprocess**: External command execution
- **json**: JSON serialization/deserialization
- **re**: Regular expressions for text processing
- **typing**: Type hints for better code documentation
- **urllib.parse**: URL parsing utilities

## Configuration

### Environment Variables
Create a `.env` file in the project root:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### File Storage
- **Transcripts**: `backend/transcript_extraction/temporary_files/transcript_{video_id}.txt`
- **Raw Transcripts**: `backend/transcript_extraction/temporary_files/raw_transcript_{video_id}.txt`
- **Segments**: `backend/transcript_extraction/temporary_files/transcript_{video_id}_{prompt}_segments.json`
- **Root Segments**: `temporary_files/{transcript_name}_{prompt}_segments.json`

### API Configuration
- **Host**: `127.0.0.1` (localhost)
- **Port**: `5000`
- **Debug Mode**: Enabled for development
- **CORS**: Enabled for frontend integration

### Frontend Configuration
- **Package Manager**: pnpm
- **Framework**: Next.js 15.3.4
- **React Version**: 19.0.0
- **TypeScript**: Enabled
- **Tailwind CSS**: v4

## Usage Examples

### 1. Start the Flask Server
```bash
cd backend
python app.py
```

### 2. Make API Request
```bash
curl "http://127.0.0.1:5000/api/get/rfG8ce4nNh0?prompt=Area%20Function%20with%20Variable%20Upper%20Bound"
```

### 3. Direct Script Usage (Backend)
```bash
cd backend/transcript_extraction
python decide_clip.py "https://www.youtube.com/watch?v=rfG8ce4nNh0" "Find segments about mathematical intuition"
```

### 4. Direct Script Usage (Root Level)
```bash
python decide_clip.py "temporary_files/transcript_rfG8ce4nNh0.txt" "Find segments about mathematical intuition"
```

### 5. Frontend Development
```bash
cd frontend
pnpm dev
```

## Error Handling

### Common Error Scenarios
1. **Missing API Key**: Check `.env` file and environment variables
2. **Invalid YouTube URL**: Ensure video ID is correct and video is accessible
3. **No Transcript Available**: Some videos may not have auto-generated subtitles
4. **Claude/OpenAI API Errors**: Check API key validity and rate limits
5. **File System Errors**: Ensure write permissions in temporary_files directory
6. **JSON Parsing Errors**: Handle malformed API responses

### Debug Information
The system provides extensive debug logging:
- Subprocess execution details
- File paths and existence checks
- API response parsing
- Error details and stack traces

## Performance Considerations

### Optimization Strategies
1. **Caching**: Transcripts are saved locally to avoid re-downloading
2. **Parallel Processing**: Future enhancement for multiple video analysis
3. **Rate Limiting**: Respect Claude/OpenAI API rate limits
4. **File Cleanup**: Consider implementing automatic cleanup of old files
5. **Streaming**: Frontend supports streaming responses

### Scalability
- **Horizontal Scaling**: Multiple Flask instances behind a load balancer
- **Database Integration**: Replace file-based storage with database
- **Queue System**: Implement background job processing for long-running analyses
- **CDN**: Static assets served via CDN for frontend