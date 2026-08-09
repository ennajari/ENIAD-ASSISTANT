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

# Copy RAG_Project source code
COPY RAG_Project/ /app/RAG_Project/
WORKDIR /app/RAG_Project/src

EXPOSE 8009

CMD ["python", "main.py"]
