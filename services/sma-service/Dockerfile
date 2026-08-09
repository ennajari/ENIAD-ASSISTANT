FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy SMA_Service source code
COPY SMA_Service/ /app/SMA_Service/
WORKDIR /app/SMA_Service

EXPOSE 8002

CMD ["python", "main.py"]
