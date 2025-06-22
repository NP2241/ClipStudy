FROM python:3.11-slim

WORKDIR /app

# Install system dependencies including yt-dlp requirements
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN pip install --no-cache-dir yt-dlp

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create temporary_files directory
RUN mkdir -p transcript_extraction/temporary_files

EXPOSE 3001

CMD ["python", "app.py"]