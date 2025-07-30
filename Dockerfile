# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy backend files
COPY package*.json ./
COPY server.js ./
COPY Routes ./Routes

# Copy frontend files
COPY client ./client

# Install backend dependencies
RUN npm install

# Install frontend dependencies and build frontend
WORKDIR /app/client
RUN npm install
RUN npm run build

# Move build to backend's public directory (optional, if you want to serve static files)
WORKDIR /app
RUN mkdir -p public && cp -r client/build/* public/

# Index the directory and write to a file
RUN ls -R /app > /app/directory_index.txt

# Expose port (change if your server uses a different port)
EXPOSE 4000

# Start the server and index directory at runtime (writes to runtime_index.txt)
CMD ls -R /app > /app/runtime_index.txt && node server.js
