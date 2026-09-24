FROM node:18-bullseye-slim

# Install Python, pip, Tesseract OCR, and required system libraries
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    tesseract-ocr \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set up application directory
WORKDIR /app

# Copy result-processor and install Python dependencies
COPY result-processor /app/result-processor
RUN pip3 install --no-cache-dir -r /app/result-processor/requirements.txt

# Copy backend package files and install Node dependencies
COPY backend/package*.json /app/backend/
WORKDIR /app/backend
RUN npm install --omit=dev

# Copy the rest of the backend code
COPY backend /app/backend/

# Expose port and start
EXPOSE 5000
CMD ["npm", "start"]
